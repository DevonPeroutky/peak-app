import React from 'react'
import PeakGoogleLogin from "../../common/signin-button/GoogleSigninButton";
import {PeakLogo} from "../../common/logo/PeakLogo";
import "./login.scss"

export const PeakLogin = (props: {}) => {
    return (
        <div className={"login-page-container"}>
            <div className={"login-container"}>
                <PeakLogo/>
                <PeakGoogleLogin/>
            </div>
        </div>
    )
};