import React from 'react'
import {PeakLogo} from "../../common/logo/PeakLogo";
import "./welcome.scss"
import config from "../../constants/environment-vars"
import DesktopGoogleLogin from "../../common/login/signin-button/desktop-google-login/DesktopGoogleLogin";
import {ELECTRON} from "../../constants/constants";
import WebappGoogleLogin from "../../common/login/signin-button/webapp-google-signin/WebappGoogleLogin";
import {useLocation, useParams } from 'react-router-dom';

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

export const PeakWelcome = (props: {}) => {
    const query = useQuery();
    const param: string | null = query.get("desktop-login")
    const desktopFlow: boolean = param != null && param == "true"

    return (
        <div className={"welcome-page-container"}>
            <div className={"welcome-container"}>
                <PeakLogo className={"welcome-logo"}/>
                { (config.dist === ELECTRON) ? <DesktopGoogleLogin/> : <WebappGoogleLogin isDesktopLogin={desktopFlow}/> }
            </div>
        </div>
    )
};