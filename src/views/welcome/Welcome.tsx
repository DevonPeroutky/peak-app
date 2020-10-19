import React from 'react'
import {PeakLogo} from "../../common/logo/PeakLogo";
import "./welcome.scss"
import config from "../../constants/environment-vars"
import DesktopGoogleLogin from "../../common/signin-button/DesktopGoogleLogin";
import {ELECTRON} from "../../constants/constants";
import WebappGoogleLogin from "../../common/signin-button/WebappGoogleLogin";


export const PeakWelcome = (props: {}) => {
    return (
        <div className={"login-page-container"}>
            <div className={"login-container"}>
                <PeakLogo/>
                { (config.dist === ELECTRON) ? <DesktopGoogleLogin/> : <WebappGoogleLogin/> }
            </div>
        </div>
    )
};