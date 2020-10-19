import React from 'react'
import {PeakLogo} from "../../common/logo/PeakLogo";
import "./login.scss"
import WebappGoogleLogin from "../../common/signin-button/WebappGoogleLogin";

// DEPRECATED: SHOULD DELETE THIS
export const PeakLogin = (props: {}) => {
    return (
        <div className={"login-page-container"}>
            <div className={"login-container"}>
                <PeakLogo/>
                <WebappGoogleLogin/>
            </div>
        </div>
    )
};