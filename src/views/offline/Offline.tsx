import React, {useEffect} from 'react'
import {PeakLogo} from "../../common/logo/PeakLogo";
import {useHistory} from "react-router";
import {useOnlineStatus} from "../../utils/hooks";
import {Alert} from "antd";

export const PeakOffline = (props: {}) => {
    const history = useHistory()
    const isOnline = useOnlineStatus()

    useEffect(() => {
        if (isOnline) {
            console.log(`GOING BACK TO THE JOURNAL`)
            history.push("/home");
        }
    })

    return (
        <div className={"welcome-page-container"}>
            <div className={"welcome-container"}>
                <PeakLogo className={"welcome-logo"}/>
                <Alert
                    message="Peak is currently not able to be used offline"
                    description="This will automatically refresh as soon are you're back online"
                    type="info"
                    showIcon
                />
            </div>
        </div>
    )
};