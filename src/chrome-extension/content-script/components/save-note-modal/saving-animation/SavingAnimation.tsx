import {SUBMITTING_STATE} from "../../../../constants/constants";
import React from "react";
import "./saving-animation.scss"
import {Lottie} from "@crello/react-lottie";
import saving from "../../../../../assets/animations/saved.json"
import saved from "../../../../../assets/animations/saving.json"

export const SavingAnimation = (props: {submittingState: SUBMITTING_STATE, closeDrawer: () => void}) => {
    return (
        <div className={"submitting-container"}>
            <Spinner {...props}/>
        </div>
    )
}


const Spinner = (props: {submittingState: SUBMITTING_STATE, closeDrawer: () => void}) => {
    const { submittingState, closeDrawer } = props
    const defaultConfig = {
        autoplay: true,
        loop: true,
        animationData: (submittingState === "submitting") ? saving : saved,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice'
        }
    };
    return (
        <div className={"animation-container"}>
            <Lottie
                config={defaultConfig}
                speed={1}
                width={"100%"}
                height={"auto"}
                lottieEventListeners={[
                    {
                        name: 'complete',
                        callback: () => {
                            console.log(`The animation completed: ${submittingState}`);
                        }
                    },
                    {
                        name: 'loopComplete',
                        callback: () => {
                            if (submittingState === "submitted") {
                                closeDrawer()
                            }
                            console.log(`LOOP IS COMPLETE: ${submittingState}`);
                        }
                    }
                ]}/>
        </div>
    )
}