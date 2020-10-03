import React from 'react'
import PeakGoogleLogin from "../../common/signin-button/GoogleSigninButton";
import {PeakLogo} from "../../common/logo/PeakLogo";
import config from "../../constants/environment-vars"
import {useQuery} from "../../utils/urls";

export const DesktopLogin = (props: {}) => {
    // TODO GET THE QUERY PARAMS
    let query = useQuery();
    const electronProtocol: string = config.electron_protocol
    const oneTimeCode: string | null = query.get("one-time-code")
    console.log(oneTimeCode)
    return (
        <div className={"login-page-container"}>
            <div className={"login-container"}>
                <PeakLogo/>
                <PeakGoogleLogin desktopDeepLinkUrl={`${electronProtocol}://login?returned-code=${oneTimeCode}`}/>
            </div>
        </div>
    )
};
