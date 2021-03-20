import * as React from "react";
import {PeakLogo} from "../../../../../../common/logo/PeakLogo";
import "./saved-page-content.scss"
import {EDITING_STATE, SUBMISSION_STATE} from "../../../../../constants/constants";
import {GoBackButton, UndoCloseButton} from "./undo-close-button/UndoCloseButton";
import {LoadingOutlined} from "@ant-design/icons/lib";
import {Spin} from "antd";

export const SavePageHeaderContent = (props: { saving: SUBMISSION_STATE, editing: EDITING_STATE, sendDeletePageMessage: () => void, goBack: () => void }) => {
    const { saving, editing } = props
    console.log(`EDITING!!! `)
    return (
        <div className={"peak-message-header-container"}>
            <div className={"peak-header-group"}>
                {(saving === SUBMISSION_STATE.Saving && editing !== EDITING_STATE.Editing)  ? <SavingLoader/> : <PeakLogo className={"peak-message-header-logo"}/> }
                <HeaderText {...props}/>
            </div>
            <HeaderIcon {...props}/>
        </div>
    )
}

export const SavingLoader = (props) => {
    const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
    return (
        <Spin className={"peak-message-header-logo"} indicator={antIcon} />
    )
}

const HeaderText = ({ editing, saving }) => {
    function pickText(subState: SUBMISSION_STATE, editingState: EDITING_STATE): string {
        if (editingState === EDITING_STATE.Deleting) {
            return "Removing..."
        } else if (editingState === EDITING_STATE.Editing) {
            return "Add your notes!"
        } else if (subState === SUBMISSION_STATE.Saving) {
            return "Saving to Peak..."
        } else {
            return "Saved!"
        }
    }

    return <h3 className={"peak-message-header"}>{pickText(saving, editing)}</h3>
}

const HeaderIcon = ({ editing, saving, sendDeletePageMessage, goBack }) => {
    if (saving === SUBMISSION_STATE.Saving) {
        return null
    } else if (editing === EDITING_STATE.Editing) {
        return <GoBackButton goBack={goBack} />
    } else {
        return <UndoCloseButton deleteBookmark={sendDeletePageMessage}/>
    }

}
