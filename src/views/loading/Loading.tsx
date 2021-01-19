import React, {useEffect, useState} from "react";
import animationData from '../../assets/animations/mountain-with-sun.json';
import {Lottie} from "@crello/react-lottie";
import "./loading.scss"

export const Loading = (props: { isLoadingCallback: (isLoading: boolean) => void, thePromised: () => Promise<any>}) => {
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
        console.log(`USING THE LOADING PROMISES`)
        thePromised().then(res => {
            setLoaded(true);
        })
    }, []);

    const isLoading = () => {
        console.log(`I AM GETTING CALLED --> ${loaded}`);
        return loaded
    };

    console.log(`RENDER LOADED ${loaded}`);
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