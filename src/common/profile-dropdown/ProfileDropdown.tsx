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

    return (
        <Dropdown overlay={menu} trigger={Array.from(["click"])}>
            <img src={user.image_url} referrerPolicy={"no-referrer"} className="profile-icon" alt="user-profile"/>
        </Dropdown>
    )
};

const UserAccountRow = (props) => {
    const switchUserAccounts = useAccountSwitcher()
    const {userAccount, currentUser, accountIndex, ...other} = props;

    function deriveWorkspaceName(domain: string): string {
        return capitalize(domain.split("@").slice(-1)[0].split(".")[0])
    }

    return (
        <Menu.Item className={"peak-account-setting-row"} {...other} onClick={() => switchUserAccounts(userAccount, currentUser.id)}>
            <div className={"peak-account-row"} >
                <div className={"peak-account-row-header"}>
                    <span>{userAccount.email}</span>
                    <SettingOutlined />
                </div>
                <div className={"peak-account-row-body"}>
                    <img src={userAccount.image_url} referrerPolicy={"no-referrer"} className="profile-icon" alt="user-profile"/>
                    <div className={"peak-account-row-body-center"}>
                        <span className={"peak-account-title"}>{userAccount.given_name}'s Wiki</span>
                        <span>{userAccount.email.endsWith("@gmail.com") ? "Personal" : deriveWorkspaceName(userAccount.email) }</span>
                    </div>
                    {(userAccount.id === currentUser.id) ? <CheckOutlined className={"selected-icon"}/> : <span>⌘{accountIndex}</span>}
                </div>
            </div>
        </Menu.Item>
    )
}
