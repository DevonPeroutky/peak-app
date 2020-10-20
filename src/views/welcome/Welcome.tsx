import React from 'react'
import {PeakLogo} from "../../common/logo/PeakLogo";
import "./welcome.scss"
import config from "../../constants/environment-vars"
import DesktopGoogleLogin from "../../common/signin-button/DesktopGoogleLogin";
import {ELECTRON} from "../../constants/constants";
import WebappGoogleLogin from "../../common/signin-button/WebappGoogleLogin";
import {useLocation, useParams } from 'react-router-dom';

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

export const PeakWelcome = (props: {}) => {
    const query = useQuery();
    const param: string | null = query.get("desktop-login")
    const desktopFlow: boolean = param != null && param == "true"

    return (
        <div className={"login-page-container"}>
            <div className={"login-container"}>
                <PeakLogo/>
                { (config.dist === ELECTRON) ? <DesktopGoogleLogin/> : <WebappGoogleLogin isDesktopLogin={desktopFlow}/> }
            </div>
        </div>
    )
};