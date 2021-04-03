import React, { useEffect, useState, ReactNode} from "react";
import "./loading.scss"
import {useQuery} from "../../utils/urls";
import {RELOAD_REASON} from "../../types";
import defaultMountainAnimation from "../../assets/animations/mountain-with-sun.json";
import recoverAnimation from "../../assets/animations/recover.json";
import switchAccountAnimation from "../../assets/animations/loading.json";
import {LoadingAnimationProps, ReactLottieContainer} from "./react-lottie-container/ReactLottieContainer";
import { useHistory } from "react-router-dom";

export interface AnimationConfig {
    animationData: any
    speed?: number
    className?: string
}

export interface PeakLoadingAnimationProps extends LoadingAnimationProps {
    containerClassName?: string
    component?: ReactNode
}

function determineAnimationData (reason: RELOAD_REASON): AnimationConfig {
    // @ts-ignore
    const fuck = RELOAD_REASON[reason] as RELOAD_REASON
    switch (fuck) {
        case RELOAD_REASON.default:
            return { animationData: defaultMountainAnimation }
        case RELOAD_REASON.recover:
            return { animationData: recoverAnimation, speed: 2 }
        case RELOAD_REASON.switch_accounts:
            return { animationData: switchAccountAnimation, speed: 3 }
        default:
            return { animationData: defaultMountainAnimation }
    }
}

export const useAppLoadingAnimation = () => {
    // All for the loading state!
    const query = useQuery();
    const history = useHistory();
    const [isLoading, setLoading] = useState(true);
    const [reloadType, setReloadType] = useState(RELOAD_REASON.default)
    const [animationData, setAnimationData] = useState<AnimationConfig>({ animationData: defaultMountainAnimation })
    const reloadReasonParam: RELOAD_REASON | null = RELOAD_REASON[query.get("reload-reason")]

    const renderLoadingAnimation = (promise: () => Promise<any>, callback?: () => any) => {
        return (
            <Loading
                callback={() => {
                    if (callback) {
                        callback()
                    } else {
                        setLoading(false)
                        history.push(`/home`)
                    }
                    // reset ResetType
                    setReloadType(RELOAD_REASON.default)
                }}
                thePromised={promise}
                animationData={animationData.animationData}
                speed={animationData.speed}/>
        )
    }

    // Forced Reloading animation handler
    useEffect(() => {
        console.log(`ReloadParam is now ${reloadReasonParam} <--> ${reloadType}`)
        if (reloadReasonParam && reloadReasonParam !== reloadType) {
            setLoading(true)
            setReloadType(reloadReasonParam)
            setAnimationData(determineAnimationData(reloadReasonParam))
        }
    }, [reloadReasonParam])

    return {
        isLoading,
        renderLoadingAnimation
    }
}

export const Loading = (props: PeakLoadingAnimationProps) => {
    const { containerClassName, component } = props;

    return (
        <div className={containerClassName}>
            <ReactLottieContainer {...props}/>
            { component }
        </div>
    )
};