import React from 'react'
import "./welcome.scss"
import config from "../../constants/environment-vars"
import DesktopGoogleLogin from "../../common/login/signin-button/desktop-google-login/DesktopGoogleLogin";
import {ELECTRON} from "../../constants/constants";
import WebappGoogleLogin from "../../common/login/signin-button/webapp-google-signin/WebappGoogleLogin";
import {PeakLogo} from "../../common/logo/PeakLogo";
import { useQuery } from 'src/utils/urls';

export const PeakWelcome = (props: {}) => {
    const query = useQuery();
    const desktopLoginParam: string | null = query.get("desktop-login")
    const loggedOutParam: string | null = query.get("logged-out-electron")
    const addAccountParam: string | null = query.get("add-account")
    const extensionLoginParam: string | null = query.get("extension-login")
    const desktopFlow: boolean = desktopLoginParam != null && desktopLoginParam == "true"
    const loggedOutFlow: boolean = loggedOutParam != null && loggedOutParam == "true"
    const addAccountFlow: boolean = addAccountParam != null && addAccountParam == "true"
    const extensionLoginFlow: boolean = extensionLoginParam != null && extensionLoginParam == "true"
    console.log(config)
    console.log(`Desktop `, desktopFlow)
    console.log(`Extension Flow? `, extensionLoginFlow)

    return (
        <div className={"welcome-page-container"}>
            <div className={"welcome-container"}>
                <PeakLogo className={"welcome-logo"}/>
                <h2 className="peak-subtitle">Learn. Share. Grow.</h2>
                { (config.dist === ELECTRON) ? <DesktopGoogleLogin/> : <WebappGoogleLogin isDesktopLogin={desktopFlow || loggedOutFlow} addAccountFlow={addAccountFlow} isExtensionLogin={extensionLoginFlow}/> }
            </div>
        </div>
    )
};