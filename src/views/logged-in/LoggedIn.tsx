import React from 'react'
import { useHistory } from 'react-router-dom';
import {PeakLogo} from "../../common/logo/PeakLogo";
import config from "../../constants/environment-vars";
import {useQuery} from "../../utils/urls";
import "./logged-in.scss"

export const LoggedIn = (props: { }) => {
    const history = useHistory()
    const query = useQuery();
    const oneTimeCode: string | null = query.get("one-time-code")
    // const addUserFlow: string | null = query.get("add-account")
    const desktopDeepLinkUrl = (oneTimeCode) ? `${config.protocol}://login?returned-code=${oneTimeCode}` : `${config.protocol}://temp-desktop-login`

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
};
