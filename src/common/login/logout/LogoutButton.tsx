import React from 'react'
import config from "../../../../src/constants/environment-vars"
import {ELECTRON} from "../../../constants/constants";
import {GoogleLogout} from "react-google-login";
import {LogoutOutlined} from "@ant-design/icons/lib";
import {Menu, message} from "antd";
import {UNAUTHED_USER} from "../../../redux/slices/user/userSlice";
import { setUser } from "../../../redux/slices/user/userSlice";
import peakAxiosClient from "../../../client/axiosConfig"
import {useDispatch} from "react-redux";
import "./logout-button.scss"
import {isElectron} from "../../../utils/environment";
import { useHistory } from 'react-router-dom';


const LogoutButton = (props: { }) => {
    const dispatch = useDispatch()
    const history = useHistory()

    const handleLogoutFailure = () => {
        message.info('Failed to logout! Let Devon know');
        dispatch(setUser(UNAUTHED_USER))
    };

    const logout = () => {
        message.info('Logged Out!');
        peakAxiosClient.post(`/api/v1/session/logout`)
        dispatch(setUser(UNAUTHED_USER))
        if (isElectron) {
            // http://localhost:3000/main_window#/welcome
            history.push(`/main_window#/welcome`)
        }
    }

    if (isElectron) {
        return (
            <div className={"logout-row"}>
                <LogoutOutlined className={"logout-row-icon"}/>
                <span onClick={logout}>Logout</span>
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
               onLogoutSuccess={logout}/>
       )
    }

};

export default LogoutButton;