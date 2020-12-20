import React from 'react'
import GoogleLogin, {GoogleLoginResponse, GoogleLoginResponseOffline} from "react-google-login";
import "./google-signin-button.scss"
import {Peaker, setUser} from "../../../../redux/userSlice";
import {connect, useDispatch} from "react-redux";
import {useHistory} from "react-router";
import {message} from "antd";
import peakAxiosClient from "../../../../client/axiosConfig";
import {v4 as uuidv4} from "uuid";
import config from "../../../../constants/environment-vars"
import {useLinkedUserId} from "../../../../utils/hooks";
import { addUserAccount } from '../../../../redux/userAccountsSlice';

const WebappGoogleLogin = (props: { isDesktopLogin: boolean }) => {
    const { isDesktopLogin } = props
    const oneTimeCode = uuidv4()
    const dispatch = useDispatch()
    const history = useHistory();

    const linkedUserId: string | null = useLinkedUserId()

    const login = (response: GoogleLoginResponse | GoogleLoginResponseOffline) => {
        console.log(`Response from Google`)
        console.log(response);
        // @ts-ignore
        const bro = response as GoogleLoginResponse
        // @ts-ignore
        const accessToken = bro.getAuthResponse(true).access_token
        const id_token = bro.getAuthResponse().id_token
        const customPeakPayload = (linkedUserId) ? {"oneTimeCode": oneTimeCode, "existing_peak_user_id": linkedUserId} : {"oneTimeCode": oneTimeCode}
        const userPayload = { "id_token": id_token, "access_token": accessToken, "user": customPeakPayload}

        peakAxiosClient.post(`/api/v1/session/login`, userPayload).then((res) => {
            const authedUser = res.data as Peaker
            dispatch(setUser(authedUser));
            dispatch(addUserAccount(authedUser));
            if (isDesktopLogin) {
                const desktopDeepLinkUrl = `${config.protocol}://login?returned-code=${oneTimeCode}`
                window.location.replace(desktopDeepLinkUrl);
                history.push(`/logged-in?one-time-code=${oneTimeCode}`);
            } else {
                history.push(`/home/journal`);
            }
        }).catch(() => {
            message.error("Error logging you into Peak. Please let Devon know");
            history.push(`/login`);
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
            buttonText="Sign in with Google"
            onSuccess={login}
            onFailure={failedResponseFromGoogle}
            theme={"light"}
            className="peak-google-login-button"
            cookiePolicy={'single_host_origin'}
        />
    )
};

export default WebappGoogleLogin;