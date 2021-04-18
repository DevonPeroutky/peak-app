import React, {useState} from 'react'
import "./profile-dropdown.scss"
import {Dropdown, Menu, message} from 'antd';
import {CheckOutlined, LinkOutlined, LogoutOutlined, SettingOutlined, UserOutlined} from "@ant-design/icons/lib";
import LogoutButton from "../login/logout/LogoutButton";
import config from "../../constants/environment-vars";
import {useCurrentUser, useIsContextElectron} from "../../utils/hooks";
import {EXISTING_PEAK_USER_ID} from "../../constants/constants";
import {useUserAccounts} from "../../utils/requests";
import {DisplayPeaker} from "../../redux/slices/userAccountsSlice";
import { capitalize } from "lodash";
import {isElectron} from "../../utils/environment";
import {useAccountSwitcher} from "../../utils/account";

export const ProfileDropdown = (props: {}) => {
    const user = useCurrentUser()
    const userAccounts: DisplayPeaker[] = useUserAccounts()

    const signinAdditionalAccount = () => {
        window.open(`${config.web_protocol}://${config.app_server_domain}/#/welcome?desktop-login=${isElectron}&${EXISTING_PEAK_USER_ID}=${user.peak_user_id}&add-account=true`, '_blank')
    }

    const menu = (
        <Menu className={"peak-account-setting-menu"}>
            {userAccounts.map((acc, index) => <UserAccountRow key={acc.id} userAccount={acc} currentUser={user} accountIndex={index}/>)}
            <Menu.Item className={"peak-account-setting-row"} onClick={signinAdditionalAccount}>
                <LinkOutlined className={"logout-row-icon"}/>
                <span>Link another account</span>
            </Menu.Item>
            <Menu.Item className={"peak-account-setting-row bottom"}>
                <LogoutButton/>
            </Menu.Item>
        </Menu>
    );

    console.log(`USER `, user)

    return (
        <div className={"account-section-container"}>
            <Dropdown overlay={menu} trigger={Array.from(["click"])}>
                <div className={"account-section"}>
                    <img src={user.image_url} referrerPolicy={"no-referrer"} className="current-account-icon" alt="user-profile"/>
                    <div className={"account-section-details"}>
                        <div className={"account-domain"}>{deriveEmailDomain(user.email)}</div>
                        <div className={"name"}>{user.given_name}</div>
                    </div>
                </div>
            </Dropdown>
        </div>
    )
};

const UserAccountRow = (props) => {
    const switchUserAccounts = useAccountSwitcher()
    const {userAccount, currentUser, accountIndex, ...other} = props;

    return (
        <Menu.Item className={"peak-account-setting-row"} {...other} onClick={() => switchUserAccounts(userAccount, currentUser.id)}>
            <div className={"peak-account-row"} >
                <div className={"peak-account-row-body"}>
                    <div>
                        <span>{userAccount.email}</span>
                        <div className={"peak-account-row-body-center"}>
                            <span className={"peak-account-title"}>{userAccount.given_name}'s Wiki</span>
                            <span>{deriveEmailDomain(userAccount.email)}</span>
                        </div>
                    </div>
                    <div>
                        {(userAccount.id === currentUser.id) ? <CheckOutlined className={"selected-icon"}/> : <span>⌘{accountIndex}</span>}
                        <img src={userAccount.image_url} referrerPolicy={"no-referrer"} className="profile-icon" alt="user-profile"/>
                    </div>
                </div>
            </div>
        </Menu.Item>
    )
}

function deriveEmailDomain(email): string {
    return email.endsWith("@gmail.com") ? "Personal" : capitalize(email.split("@").slice(-1)[0].split(".")[0])
}
