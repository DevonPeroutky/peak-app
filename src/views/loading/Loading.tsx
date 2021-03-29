import React, {useEffect, useState} from "react";
import animationData from '../../assets/animations/mountain-with-sun.json';
import {Lottie} from "@crello/react-lottie";
import "./loading.scss"

export interface LoadingAnimationProps {
    isLoadingCallback: (isLoading: boolean) => void
    thePromised: () => Promise<any>
}

export const Loading = (props: LoadingAnimationProps) => {
    const [loaded, setLoaded] = useState(true);
    const { thePromised, isLoadingCallback } = props;

    const defaultConfig = {
        autoplay: true,
        loop: true,
        animationData: animationData,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice'
        }
    };

    useEffect(() => {
        thePromised().then(res => {
            setLoaded(true);
        })
    }, []);

    const isLoading = () => {
        return loaded
    };

    return (
        <div className={"peak-loader"}>
            <Lottie config={defaultConfig} height="400px" width="400px" speed={2.5} lottieEventListeners={[
                {
                    name: 'complete',
                    callback: () => {
                        console.log('The animation completed:');
                    }
                },
                {
                    name: 'loopComplete',
                    callback: () => {
                        if (isLoading()) {
                            isLoadingCallback(false);
                        }
                    }
                },
            ]}/>
        </div>
    )
};