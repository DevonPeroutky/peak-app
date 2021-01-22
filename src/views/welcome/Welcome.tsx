import React from 'react'
import "./welcome.scss"
import config from "../../constants/environment-vars"
import DesktopGoogleLogin from "../../common/login/signin-button/desktop-google-login/DesktopGoogleLogin";
import {ELECTRON} from "../../constants/constants";
import WebappGoogleLogin from "../../common/login/signin-button/webapp-google-signin/WebappGoogleLogin";
import {useLocation, useParams } from 'react-router-dom';
import {PeakLogo} from "../../common/logo/PeakLogo";

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

export const PeakWelcome = (props: {}) => {
    const query = useQuery();
    const desktopLoginParam: string | null = query.get("desktop-login")
    const loggedOutParam: string | null = query.get("logged-out-electron")
    const desktopFlow: boolean = desktopLoginParam != null && desktopLoginParam == "true"
    const loggedOutFlow: boolean = loggedOutParam != null && loggedOutParam == "true"

    return (
        <div className={"welcome-page-container"}>
            <div className={"welcome-container"}>
                <PeakLogo className={"welcome-logo"}/>
                <h2 className="peak-subtitle">Learn. Share. Grow.</h2>
                { (config.dist === ELECTRON) ? <DesktopGoogleLogin/> : <WebappGoogleLogin isDesktopLogin={desktopFlow || loggedOutFlow}/> }
            </div>
        </div>
    )
};