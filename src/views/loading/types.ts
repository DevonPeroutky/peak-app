import {ReactNode} from "react";

interface AnimationConfig {
    animationData: any
    speed?: number
    className?: string
}

export interface ReactLottieContainerProps extends AnimationConfig {
    promise: () => Promise<any>
    callback?: () => void
}


export interface PeakLoadingAnimationProps extends AnimationConfig {
    containerClassName?: string
    component?: ReactNode
}

export interface PeakLoadingContainerProps extends PeakLoadingAnimationProps, ReactLottieContainerProps {}
