import {Divider} from "antd";
import {EDITING_STATE, SUBMISSION_STATE} from "../../../../../constants/constants";
import {SavingAnimation, SavingSkeleton} from "./saving-animation/SavingAnimation";
import {closeMessage} from "../../SavePageMessage";
import * as React from "react";


export const PageSavingAnimation = (props: {saving: SUBMISSION_STATE, editingState: EDITING_STATE, tabId: number}) => {
    const { saving, editingState, tabId } = props
    return (
        <div className={"peak-message-content-container"}>
            <Divider className={"peak-extension-divider"}/>
            {(editingState === EDITING_STATE.Editing) ?
                <SavingAnimation submittingState={saving} onComplete={() => closeMessage(tabId)}/>
                : <SavingSkeleton/>
            }
        </div>
    )
}