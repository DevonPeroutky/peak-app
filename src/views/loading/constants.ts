import {PeakLoadingAnimationProps, PeakLoadingContainerProps} from "./types";
import switchAccountAnimation from "../../assets/animations/loading.json";
import defaultMountainAnimation from "../../assets/animations/mountain-with-sun.json";
import recoverAnimation from "../../assets/animations/recover.json";
import {RELOAD_REASON} from "../../types";
import {useCallback} from "react";
import {loadEntireWorldForAllAccounts} from "../../utils/loading-util";
import {useCurrentUser} from "../../utils/hooks";

export const LOAD_ENTIRE_WORLD_FOR_USER: PeakLoadingAnimationProps = {
    animationData: defaultMountainAnimation,
    className: "load-user-animation"
}
export const RECOVER_ANIMATION: PeakLoadingAnimationProps = {
    animationData: recoverAnimation,
    speed: 2,
    className: "recover-animation"
}
export const SWITCH_ACCOUNT_ANIMATION: PeakLoadingAnimationProps = {
    animationData: switchAccountAnimation,
    speed: 3,
    className: "switch-account-animation"
}

export function useAnimationData(): (reason: string) => PeakLoadingContainerProps {
    const currentUser = useCurrentUser()

    // LoadEverything callback
    const loadEverything = useCallback(() => {
        return loadEntireWorldForAllAccounts(currentUser.id, currentUser.peak_user_id)
    }, [currentUser])

    return (reason: string) => {
        switch (reason) {
            case RELOAD_REASON.default:
                return {
                    ...LOAD_ENTIRE_WORLD_FOR_USER,
                    promise: loadEverything
                }
            case RELOAD_REASON.recover:
                return {
                    ...RECOVER_ANIMATION,
                    promise: loadEverything
                }
            case RELOAD_REASON.switch_accounts:
                return {
                    ...SWITCH_ACCOUNT_ANIMATION,
                    promise: loadEverything
                }
            default:
                return {
                    ...LOAD_ENTIRE_WORLD_FOR_USER,
                    promise: loadEverything
                }
        }
    }
}
