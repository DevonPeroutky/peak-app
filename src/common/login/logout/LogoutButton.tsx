import React from 'react'
import config from "../../../../src/constants/environment-vars"
import {ELECTRON} from "../../../constants/constants";
import {GoogleLogout} from "react-google-login";
import {LogoutOutlined} from "@ant-design/icons/lib";
import {Menu, message} from "antd";
import {UNAUTHED_USER} from "../../../redux/userSlice";
import { setUser } from "../../../redux/userSlice";
import { useHistory } from 'react-router-dom';
import {useDispatch} from "react-redux";
import "./logout-button.scss"

const LogoutButton = (props: { }) => {
    const dispatch = useDispatch()

    const logoutWebapp = () => {
        message.info('Logged Out!');
        dispatch(setUser(UNAUTHED_USER))
    };

    const handleLogoutFailure = () => {
        message.info('Failed to logout!');
        dispatch(setUser(UNAUTHED_USER))
    };

    const logoutElectron = () => {
        message.info('Logged Out!');
        dispatch(setUser(UNAUTHED_USER))
    }

    if (config.dist === ELECTRON) {
        return (
            <div className={"logout-row"}>
                <LogoutOutlined className={"logout-row-icon"}/>
                <a href={`${config.base_url}/#/welcome?logged-out-electron=true`} target="_blank" onClick={logoutElectron}>Logout</a>
            </div>
        )
    } else {
       return (
           <GoogleLogout
               clientId="261914177641-0gu5jam6arv5m6n95vdjmfu8hpa1kunj.apps.googleusercontent.com"
               render={ renderProps => (
                   <div className={"logout-row"}>
                       <span onClick={renderProps.onClick}>Logout</span>
                   </div>
               )}
               onFailure={handleLogoutFailure}
               onLogoutSuccess={logoutWebapp}/>
       )
    }

};

export default LogoutButton;