import React, {useCallback, useEffect, useState} from "react";
import {Lottie, ReactLottieConfig} from "@crello/react-lottie";
import cn from "classnames"
import "./react-lottie-container.scss"

export interface AnimationConfig {
    animationData: any
    speed?: number
    className?: string
}

export interface LoadingAnimationProps extends AnimationConfig {
    callback: () => void
    thePromised: () => Promise<any>
}

export const ReactLottieContainer = (props: LoadingAnimationProps) => {
    const [loaded, setLoaded] = useState(true);
    const { thePromised, callback, animationData, className, speed } = props;

    const defaultConfig: ReactLottieConfig = {
        autoplay: true,
        loop: true,
        animationData: animationData,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice'
        }
    };

    useEffect(() => {
        thePromised().then(res => {
            setLoaded(true)
        })
    }, []);

    const isLoading = useCallback(() => {
        return loaded
    }, [loaded]);

    return (
        <div className={cn("peak-react-lottie-container", className ? className : "")}>
            <Lottie config={defaultConfig} height="400px" width="400px" speed={speed | 2.5} lottieEventListeners={[
                {
                    name: 'complete',
                    callback: () => {
                        console.log('The animation completed:');
                    }
                },
                {
                    name: 'loopComplete',
                    callback: () => {
                        console.log(`Loop has completed!`)
                        if (isLoading()) {
                            console.log(`Loop has completed and we are done!`)
                            callback();
                        }
                    }
                },
            ]}/>
        </div>
    )
};