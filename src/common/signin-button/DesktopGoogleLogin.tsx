import React from 'react'
import "./google-signin-button.scss"
import config from "../../../src/constants/environment-vars"

const DesktopGoogleLogin = (props: { }) => {

    return (
        <div>
            <a href={`${config.base_url}/#/welcome?desktop-login=true`} target="_blank">Sign in with Google to use Peak</a>
        </div>
    )
};

export default DesktopGoogleLogin;