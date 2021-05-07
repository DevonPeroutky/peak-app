import React, {useState} from 'react'
import { useHistory } from 'react-router-dom';
import {Loading} from "../loading/Loading";
import {loadEntireWorldForAllAccounts} from "../../utils/loading-util";
import {useCurrentUser} from "../../utils/hooks";
import animationData from "../../assets/animations/mountain-with-sun.json";
import "./temp-desktop-login.scss"

export const TempDesktopLogin = (props: { }) => {
    const history = useHistory()
    const currentUser = useCurrentUser()

    const [isLoading, setLoading] = useState(true);
    const loadEverything: () => Promise<void> = () => loadEntireWorldForAllAccounts(currentUser.id, currentUser.peak_user_id)

    if (isLoading) {
        history.push(`/home`)
    }

    return (
        <Loading callback={() => setLoading(false)} promise={loadEverything} animationData={animationData}/>
    )
};
