import React, {useCallback, useEffect, useState} from "react";
import {Lottie, ReactLottieConfig} from "@crello/react-lottie";
import cn from "classnames"
import "./loading.scss"

export interface LoadingAnimationProps {
    callback: () => void
    thePromised: () => Promise<any>
    animationData: any
    speed?: number
    className?: string
}

export const Loading = (props: LoadingAnimationProps) => {
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
        console.log(`Promise has Started!!!`)
        thePromised().then(res => {
            console.log(`Promise has completed!!!!!`)
            setLoaded(true)
        })
    }, []);

    const isLoading = useCallback(() => {
        console.log(`ARE WE LOADING NOW: ${loaded}`)
        return loaded
    }, [loaded]);


    return (
        <div className={cn("peak-loader", className ? className : "")}>
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