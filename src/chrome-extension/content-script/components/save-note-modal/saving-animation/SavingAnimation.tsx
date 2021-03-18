import {SUBMISSION_STATE} from "../../../../constants/constants";
import React from "react";
import "./saving-animation.scss"
import {Lottie} from "@crello/react-lottie";
import saving from "../../../../../assets/animations/saved.json"
import saved from "../../../../../assets/animations/saving.json"
import {sleep} from "../../../../utils/generalUtil";

export const SavingAnimation = (props: {submittingState: SUBMISSION_STATE, closeDrawer: () => void}) => {
    return (
        <div className={"submitting-container"}>
            <Spinner {...props}/>
            { (props.submittingState === SUBMISSION_STATE.Saving) ? null : <HowToOpenNoteFooter/>}
        </div>
    )
}


const Spinner = (props: {submittingState: SUBMISSION_STATE, closeDrawer: () => void}) => {
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
    const config = (submittingState === SUBMISSION_STATE.Saving) ? savingConfig : savedConfig

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
                            if (submittingState !== SUBMISSION_STATE.Saving) {
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
