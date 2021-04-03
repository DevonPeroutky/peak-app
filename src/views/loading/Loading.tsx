import React, {useEffect, useState, useCallback} from "react";
import "./loading.scss"
import {useQuery} from "../../utils/urls";
import {RELOAD_REASON} from "../../types";
import {ReactLottieContainer} from "./react-lottie-container/ReactLottieContainer";
import { useHistory } from "react-router-dom";
import {loadEntireWorldForAllAccounts} from "../../utils/loading-util";
import {useCurrentUser} from "../../utils/hooks";
import {PeakLoadingAnimationProps, PeakLoadingContainerProps} from "./types";
import {determineAnimationData, LOAD_ENTIRE_WORLD_FOR_USER} from "./constants";

export const useAppLoadingAnimation = () => {
    // All for the loading state!
    const query = useQuery();
    const history = useHistory();
    const currentUser = useCurrentUser()
    const [isLoading, setLoading] = useState(true);
    const reloadReasonParam: RELOAD_REASON | undefined = query.get("reload-reason") as RELOAD_REASON
    console.log(`RELOAD REASON PARAM `, reloadReasonParam)
    const initialAnimationData = determineAnimationData(reloadReasonParam)
    const [animation, setAnimation] = useState<PeakLoadingAnimationProps | undefined>(initialAnimationData)

    // LoadEverything callback
    const loadEverything = useCallback(() => {
        return loadEntireWorldForAllAccounts(currentUser.id, currentUser.peak_user_id)
    }, [currentUser])

    const renderLoadingAnimation = useCallback(() => (promise: () => Promise<any>, callback?: () => any) => {
        const loadingAnimation: PeakLoadingAnimationProps = determineAnimationData(reloadReasonParam)
        return (
            <Loading
                callback={() => {
                    if (callback) {
                        callback()
                    } else {
                        setLoading(false)
                        history.push(`/home`)
                    }
                }}
                promise={promise}
                animationData={animation.animationData}
                speed={animation.speed}/>
        )
    }, [animation])

    // Forced Reloading animation handler
    useEffect(() => {
        console.log(`ReloadParam is now ${reloadReasonParam}`)
        if (reloadReasonParam) {
            setLoading(true)
            setAnimation(determineAnimationData(reloadReasonParam))
        }
    }, [reloadReasonParam])

    return {
        isLoading,
        renderLoadingAnimation
    }
}

export const Loading = (props: PeakLoadingContainerProps) => {
    const { containerClassName, component } = props;

    return (
        <div className={containerClassName}>
            <ReactLottieContainer {...props}/>
            { component }
        </div>
    )
};