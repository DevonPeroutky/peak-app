import React from 'react'
import { useHistory } from 'react-router-dom';
import {PeakLogo} from "../../common/logo/PeakLogo";
import config from "../../constants/environment-vars";
import {useQuery} from "../../utils/urls";
import "./logged-in.scss"
import {LOGIN_FLOW} from "../../constants/types";

export const LoggedIn = (props: { loginFlow: LOGIN_FLOW }) => {
    if (props.loginFlow === LOGIN_FLOW.Desktop) {
        return <DesktopLoginDisplay/>
    } else {
        return <ExtensionLoggedInDisplay/>
    }
};

const DesktopLoginDisplay = (props) => {
    const history = useHistory()
    const query = useQuery();
    const oneTimeCode: string | null = query.get("one-time-code")
    // const addUserFlow: string | null = query.get("add-account")
    const desktopDeepLinkUrl = (oneTimeCode) ? `${config.electron_protocol}://login?returned-code=${oneTimeCode}` : `${config.electron_protocol}://temp-desktop-login`

    return (
        <div className={"logged-in-page-container"}>
            <div className={"logged-in-container"}>
                <PeakLogo className={"logged-in-logo"}/>
                <span>Redirecting to your Peak app...</span>
                <a href={desktopDeepLinkUrl} target="_blank">If you weren't redirected, click here.</a>
                <a onClick={() => history.push(`/home/journal`)}>Or, continue in your browser</a>
            </div>
        </div>
    )

}

const ExtensionLoggedInDisplay = (props) => {
    return (
        <div className={"logged-in-page-container"}>
            <div className={"logged-in-container"}>
                <PeakLogo className={"logged-in-logo"}/>
                <span>🎉  You have connected the extension! You can now saw pages by pressing <span className="peak-hotkey-decoration">⌘ + ⇧ + S</span></span>
            </div>
        </div>
    )
}
