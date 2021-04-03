import React, {useCallback, useEffect, useState} from "react";
import {Lottie, ReactLottieConfig} from "@crello/react-lottie";
import cn from "classnames"
import "./react-lottie-container.scss"
import {ReactLottieContainerProps} from "../types";

export const ReactLottieContainer = (props: ReactLottieContainerProps) => {
    const [loaded, setLoaded] = useState(true);
    const { promise, callback, animationData, className, speed } = props;

    const defaultConfig: ReactLottieConfig = {
        autoplay: true,
        loop: true,
        animationData: animationData,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice'
        }
    };

    useEffect(() => {
        promise().then(res => {
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
                            if (callback) {
                                callback();
                            }
                        }
                    }
                },
            ]}/>
        </div>
    )
};