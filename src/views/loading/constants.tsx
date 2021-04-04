import React, {useCallback} from "react";
import {PeakLoadingAnimationProps, PeakLoadingContainerProps} from "./types";
import switchAccountAnimation from "../../assets/animations/loading.json";
import defaultMountainAnimation from "../../assets/animations/mountain-with-sun.json";
import recoverAnimation from "../../assets/animations/recover.json";
import {RELOAD_REASON} from "../../types";
import {loadEntireWorldForAllAccounts} from "../../utils/loading-util";
import {useCurrentUser} from "../../utils/hooks";

export const LOAD_ENTIRE_WORLD_FOR_USER: PeakLoadingAnimationProps = {
    animationData: defaultMountainAnimation,
    speed: 2,
    animationClassName: "load-user-animation"
}
export const RECOVER_ANIMATION: PeakLoadingAnimationProps = {
    animationData: recoverAnimation,
    speed: .5,
    animationClassName: "recover-animation"
}
export const SWITCH_ACCOUNT_ANIMATION: PeakLoadingAnimationProps = {
    animationData: switchAccountAnimation,
    speed: 3,
    animationClassName: "switch-account-animation"
}

export function useAnimationData(): (reason: string) => PeakLoadingContainerProps {
    const currentUser = useCurrentUser()

    const loadEverything = useCallback(() => {
        return loadEntireWorldForAllAccounts(currentUser.id, currentUser.peak_user_id)
    }, [currentUser])

    return (reason: string) => {
        switch (reason) {
            case RELOAD_REASON.default:
                return {
                    ...LOAD_ENTIRE_WORLD_FOR_USER,
                    promise: loadEverything,
                    containerClassName: "main-loading-animation-container"
                }
            case RELOAD_REASON.recover:
                return {
                    ...RECOVER_ANIMATION,
                    promise: loadEverything,
                    containerClassName: "main-loading-animation-container",
                    component: <h2 className={"animation-description"}>Hit an unexpected error. Going to reload your state</h2>
                }
            case RELOAD_REASON.switch_accounts:
                return {
                    ...SWITCH_ACCOUNT_ANIMATION,
                    promise: loadEverything,
                    containerClassName: "main-loading-animation-container",
                    component: <h2 className={"animation-description"}>Switching users</h2>
                }
            default:
                return {
                    ...LOAD_ENTIRE_WORLD_FOR_USER,
                    promise: loadEverything,
                    containerClassName: "main-loading-animation-container"
                }
        }
    }
}
