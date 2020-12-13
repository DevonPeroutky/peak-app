import React, {useEffect, useState} from "react";
import animationData from '../../assets/animations/mountain-with-sun.json';
import {Lottie} from "@crello/react-lottie";
import "./loading.scss"
import {syncCurrentStateToLocalStorage} from "../../redux/localStoreSync";
import {useCurrentUser} from "../../utils/hooks";

export const Loading = (props: { isLoadingCallback: (isLoading: boolean) => void, thePromised: (() => Promise<void>)[]}) => {
    const [loaded, setLoaded] = useState(true);
    const user = useCurrentUser()

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
        const callPromises: Promise<any>[] = thePromised.map(function (callback) {
            return callback()
        });

        Promise.all(callPromises).then(res => {
            console.log(`Syncing user to locastorage`)
            syncCurrentStateToLocalStorage(user.id)
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