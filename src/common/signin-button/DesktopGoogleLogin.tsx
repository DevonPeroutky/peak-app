import React from 'react'
import GoogleLogin, {GoogleLoginResponse, GoogleLoginResponseOffline} from "react-google-login";
import "./google-signin-button.scss"
import {Peaker, setUser} from "../../redux/userSlice";
import {connect, useDispatch} from "react-redux";
import {useHistory} from "react-router";
import {message} from "antd";
import {backend_host_address} from "../../constants/constants";
import {v4 as uuidv4} from "uuid";
import config from "../../../src/constants/environment-vars"
import axios from "axios"

const DesktopGoogleLogin = (props: { }) => {
    const oneTimeCode = uuidv4()
    const dispatch = useDispatch()
    let history = useHistory();

    const login = (response: GoogleLoginResponse | GoogleLoginResponseOffline) => {
        console.log(`Response from Google`)
        console.log(response);
        // @ts-ignore
        console.log(response.wc);
        const bro = response as GoogleLoginResponse

        // TODO: INVESTIGATE why we need this
        // @ts-ignore
        const accessToken = (bro.accessToken) ? bro.accessToken : response.wc.access_token

        axios.post(`${backend_host_address}/api/v1/users`, { "user": {...bro.profileObj, ...{"accessToken": accessToken}, "oneTimeCode": oneTimeCode} }).then((res) => {
            const authedUser = res.data.data as Peaker
            dispatch(setUser(authedUser));

            const desktopDeepLinkUrl = `${config.protocol}://login?returned-code=${oneTimeCode}`
            window.location.replace(desktopDeepLinkUrl);

        }).catch(() => {
            message.error("Error logging you into Peak. Please let Devon know");
            history.push(`/login-failed`);
        })
    };

    const failedResponseFromGoogle = (responseGoogle: any) => {
        console.log(`Error Response from Google`)
        console.log(responseGoogle)
        message.error("Error trying authenticate with Google. Please try again from the Desktop App. Definitely let Devon know as well");
        history.push(`/login`);
    }

    return (
        <GoogleLogin
            clientId="261914177641-0gu5jam6arv5m6n95vdjmfu8hpa1kunj.apps.googleusercontent.com"
            buttonText="Sign into Peak with Google"
            // onSuccess={login}
            // onFailure={failedResponseFromGoogle}
            theme={"light"}
            uxMode={"redirect"}
            redirectUri={`${config.base_url}/login-via-desktop`}
            className="peak-google-login-button"
            cookiePolicy={'single_host_origin'}
        />
    )
};

export default DesktopGoogleLogin;