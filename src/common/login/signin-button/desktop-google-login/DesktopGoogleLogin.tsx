import React from 'react'
import config from "../../../../constants/environment-vars"
import {Button} from "antd";
import {GoogleOutlined} from "@ant-design/icons/lib";
import "./desktop-google-login.scss"

const DesktopGoogleLogin = (props: { }) => {

    return (
        <Button className="peak-electron-welcome-button" type="primary" icon={<GoogleOutlined />} onClick={() => window.open(`${config.web_protocol}://${config.app_server_domain}/#/welcome?desktop-login=true`, '_blank')} >
            Continue securely with Google
        </Button>
    )
};

export default DesktopGoogleLogin;