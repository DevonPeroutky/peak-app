import React from 'react'
import GoogleLogin, {GoogleLoginResponse, GoogleLoginResponseOffline} from "react-google-login";
import "./google-signin-button.scss"
import {Peaker, setUser} from "../../redux/userSlice";
import {connect, useDispatch} from "react-redux";
import {useHistory} from "react-router";
import useAxios from "axios-hooks";
import {message} from "antd";
import {backend_host_address} from "../../constants/constants";

const PeakGoogleLogin = (props: { desktopDeepLinkUrl?: string }) => {
    const { desktopDeepLinkUrl } = props;
    const dispatch = useDispatch()
    let history = useHistory();
    const [{ data, loading, error}, executePost] = useAxios(`${backend_host_address}/api/v1/users`);

    const login = (response: GoogleLoginResponse | GoogleLoginResponseOffline) => {
        console.log(`Response from Google`)
        console.log(response);
        // @ts-ignore
        console.log(response.wc);
        const bro = response as GoogleLoginResponse

        // TODO: INVESTIGATE why we need this
        // @ts-ignore
        const accessToken = (bro.accessToken) ? bro.accessToken : response.wc.access_token

        executePost({
            method: "POST",
            data: {
                "user": {...bro.profileObj, ...{"accessToken": accessToken}}
            }
        }).then((res) => {
            const authedUser = res.data.data as Peaker
            dispatch(setUser(authedUser));

            console.log(`DESKTOP!`)
            console.log(desktopDeepLinkUrl)
            if (desktopDeepLinkUrl) {
                window.location.replace(desktopDeepLinkUrl);
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

export default PeakGoogleLogin;