import React, {useEffect, useState, useCallback} from "react";
import {useQuery} from "../../utils/urls";
import {RELOAD_REASON} from "../../types";
import {ReactLottieContainer} from "./react-lottie-container/ReactLottieContainer";
import { useHistory } from "react-router-dom";
import {PeakLoadingContainerProps} from "./types";
import {useAnimationData} from "./constants";
import "./loading.scss"

export const useAppLoadingAnimation = () => {
    const query = useQuery();
    const history = useHistory();
    const [isLoading, setLoading] = useState(true);
    const reloadReasonParam: RELOAD_REASON | undefined = query.get("reload-reason") as RELOAD_REASON
    console.log(`RELOAD REASON PARAM `, reloadReasonParam)
    const determineAnimationData = useAnimationData()
    const [animation, setAnimation] = useState<PeakLoadingContainerProps | undefined>(determineAnimationData(reloadReasonParam))

    const renderLoadingAnimation = useCallback((promise: () => Promise<any>, callback?: () => any) => {
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
                {...animation}
                />
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