import React from "react";
import {PeakExtensionLoginButton} from "../../../common/login-button/LoginButton";
import {PeakLogo} from "../../../../common/logo/PeakLogo";
import "./login-user-message.scss"

export const PeakExtensionLoginBody = (props) => {
    return (
        <div className={"peak-login-body-container"}>
            <div>To save this page to Peak, we need to login you in first. </div>
            <PeakExtensionLoginButton/>
        </div>
    )
}

export const PeakExtensionLoginHeader = (props) => {
    return (
        <div className="peak-login-message-header">
            <PeakLogo/> Peak
        </div>
    )
}
