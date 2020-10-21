import React from 'react'
import "./google-profile-icon.scss"
import {Peaker, UNAUTHED_USER} from "../../redux/userSlice";
import { AppState } from "../../redux";
import { setUser } from "../../redux/userSlice";
import { connect } from "react-redux";
import {Dropdown, Menu, message} from 'antd';
import {UserOutlined} from "@ant-design/icons/lib";
import LogoutButton from "../login/logout/LogoutButton";
import {url} from "inspector";

const GoogleProfileIcon = (props: { setUser: (user: Peaker) => void, user: Peaker }) => {
    const { user, setUser } = props;
    console.log(`THE URL: ${user.image_url}`)


    const menu = (
        <Menu>
            <Menu.Item onClick={() => message.warning("Account Profile not implemented yet!")}>
                <UserOutlined/> Account
            </Menu.Item>
            <Menu.Item>
                <LogoutButton/>
            </Menu.Item>
        </Menu>
    );

    return (
        <Dropdown overlay={menu}>
            <img src={user.image_url} referrerPolicy={"no-referrer"} className="profile-icon" alt="user-profile"/>
        </Dropdown>
    )
};

const mapStateToProps = (state: AppState) => ({ user: state.user});
const mapDispatchToProps = { setUser };
export default connect(mapStateToProps, mapDispatchToProps)(GoogleProfileIcon);