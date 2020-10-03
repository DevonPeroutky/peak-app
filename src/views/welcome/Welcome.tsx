import React from 'react'
import {PeakLogo} from "../../common/logo/PeakLogo";
import "./welcome.scss"
import {v4 as uuidv4} from "uuid";
import config from "../../constants/environment-vars"


export const PeakWelcome = (props: {}) => {
    console.log(`Welcoming`)
    const one_time_code = uuidv4();
    return (
        <div className={"login-page-container"}>
            <div className={"login-container"}>
                <PeakLogo/>
                <div>
                    <a target="_blank" href={`${config.base_url}/login-via-desktop?oneTimeCode=${one_time_code}`}>Login with Google</a>
                </div>
            </div>
        </div>
    )
};