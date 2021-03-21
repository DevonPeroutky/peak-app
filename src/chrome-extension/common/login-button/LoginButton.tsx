import React from "react";
import {Button} from "antd";
import 'antd/lib/button/style/index.css';
import {GoogleOutlined} from "@ant-design/icons/lib";
import config from "../../../constants/environment-vars";
import "./login-button.scss"

export const PeakExtensionLoginButton = (props: { onClick?: () => void }) => {
    const { onClick } = props
    return (
        <Button
            className="peak-extension-login-button"
            type="primary"
            icon={<GoogleOutlined />}
            onClick={() => {
                if (onClick) {
                    onClick()
                }
                window.open(`${config.web_protocol}://${config.app_server_domain}/#/welcome?extension-login=true`, '_blank')
            }}
        >
            Login
        </Button>
    )
}

