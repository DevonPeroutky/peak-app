import {SUBMITTING_STATE} from "../../../../constants/constants";
import React from "react";
import "./saving-animation.scss"
import {Lottie} from "@crello/react-lottie";
import saving from "../../../../../assets/animations/saved.json"
import saved from "../../../../../assets/animations/saving.json"
import {sleep} from "../../../../utils/generalUtil";
import {PeakLogo} from "../../../../../common/logo/PeakLogo";

export const SavingAnimation = (props: {submittingState: SUBMITTING_STATE, closeDrawer: () => void}) => {
    return (
        <div className={"submitting-container"}>
            <Spinner {...props}/>
            { (props.submittingState === "submitting") ? null : <HowToOpenNoteFooter/>}
        </div>
    )
}


const Spinner = (props: {submittingState: SUBMITTING_STATE, closeDrawer: () => void}) => {
    const { submittingState, closeDrawer } = props

    const savingConfig = {
        autoplay: true,
        loop: true,
        animationData: saving,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice'
        }
    };
    const savedConfig = {
        autoplay: true,
        loop: false,
        animationData: saved,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice'
        }
    };
    const config = (submittingState === "submitting") ? savingConfig : savedConfig

    return (
        <div className={"animation-container"}>
            <Lottie
                config={config}
                speed={1}
                className={"peak-saving-animation"}
                lottieEventListeners={[
                    {
                        name: 'complete',
                        callback: () => {
                            if (submittingState !== "submitting") {
                                sleep(2000).then(r => {
                                    closeDrawer()
                                })
                            }
                        }
                    }
                ]}/>
        </div>
    )
}

const HowToOpenNoteFooter = (props) => {
    return (
        <span className="how-to-open-container animate__animated animate__fadeInUp">
            Press <span className="hotkey-decoration">⌘ + ⇧ + <span className="arrow">↵</span></span> to view your Note
        </span>
    )
}
