import React from 'react'
import config from "../../../../constants/environment-vars"
import "./desktop-google-login.scss"
import {Button} from "antd";
import {GoogleOutlined} from "@ant-design/icons/lib";

const DesktopGoogleLogin = (props: { }) => {

    return (
        <Button type="primary" icon={<GoogleOutlined />} onClick={() => window.open(`${config.base_url}/#/welcome?desktop-login=true`, '_blank')} >
            Continue securely with Google
        </Button>

    )
};

export default DesktopGoogleLogin;