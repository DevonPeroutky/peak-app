import React from 'react'
import "./google-profile-icon.scss"
import {Peaker, UNAUTHED_USER} from "../../redux/userSlice";
import { AppState } from "../../redux";
import { setUser } from "../../redux/userSlice";
import { connect } from "react-redux";
import {Dropdown, Menu, message} from 'antd';
import {GoogleLogout} from "react-google-login";
import {LogoutOutlined, UserOutlined} from "@ant-design/icons/lib";

const GoogleProfileIcon = (props: { setUser: (user: Peaker) => void, user: Peaker }) => {
    const { user, setUser } = props;

    const logout = () => {
        message.info('Logged Out!');
        setUser(UNAUTHED_USER)
    };

    const handleLogoutFailure = () => {
        message.info('Failed to logout!');
        setUser(UNAUTHED_USER)
    };

    const menu = (
        <Menu>
            <Menu.Item onClick={() => message.warning("Account Profile not implemented yet!")}>
                <UserOutlined/> Account
            </Menu.Item>
            <Menu.Item>
                <GoogleLogout
                    clientId="261914177641-0gu5jam6arv5m6n95vdjmfu8hpa1kunj.apps.googleusercontent.com"
                    render={ renderProps => (
                        <>
                            <LogoutOutlined/><span onClick={renderProps.onClick}>Logout</span>
                        </>
                    )}
                    onFailure={handleLogoutFailure}
                    onLogoutSuccess={logout}/>
            </Menu.Item>
        </Menu>
    );

    return (
        <Dropdown overlay={menu}>
            <img src={user.image_url} className="profile-icon" alt="user-profile"/>
        </Dropdown>
    )
};

const mapStateToProps = (state: AppState) => ({ user: state.user});
const mapDispatchToProps = { setUser };
export default connect(mapStateToProps, mapDispatchToProps)(GoogleProfileIcon);