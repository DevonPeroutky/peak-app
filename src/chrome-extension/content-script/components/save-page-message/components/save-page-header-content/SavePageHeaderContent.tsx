import * as React from "react";
import {PeakLogo} from "../../../../../../common/logo/PeakLogo";
import "./saved-page-header-content.scss"
import {EDITING_STATE, SUBMISSION_STATE} from "../../../../../constants/constants";
import {GoBackButton, UndoCloseButton} from "./undo-close-button/UndoCloseButton";
import {LoadingOutlined} from "@ant-design/icons/lib";
import {Spin} from "antd";

export const SavePageHeaderContent = (props: { saving: SUBMISSION_STATE, editing: EDITING_STATE, sendDeletePageMessage: () => void, goBack: () => void }) => {
    const { saving, editing } = props
    return (
        <div className={"peak-message-header-container animate__animated animate__fadeIn"}>
            <div className={"peak-header-group"}>
                {(saving === SUBMISSION_STATE.Saving && editing !== EDITING_STATE.Editing)  ? <SavingLoader/> : <PeakLogo className={"peak-message-header-logo"}/> }
                <HeaderText {...props}/>
            </div>
            <NoteLinkIcon saving={saving} editing={editing}/>
            <HeaderIcon {...props}/>
        </div>
    )
}

export const NoteLinkIcon = ({ saving, editing }) => {
    if (saving === SUBMISSION_STATE.Saving || editing !== EDITING_STATE.NotEditing) {
        return null
    } else {
        return (
            <span className={"view-note-instruction animate__animated animate__fadeInUp"}>
                <span className="peak-hotkey-decoration">⌘ + ⇧ +
                    <span className="arrow">↵</span>
                </span> to view your Note
            </span>
        )
    }
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
        } else if (subState === SUBMISSION_STATE.Saving) {
            return "Saving to Peak..."
        } else {
            return "Saved!"
        }
    }

    if (editing === EDITING_STATE.Editing && saving === SUBMISSION_STATE.Saved) {
        return (
            <h3 className={"peak-message-header instruction animate__animated animate__fadeIn animate__slow"}>
                Press <span className="peak-hotkey-decoration">⌘ + ⇧ + S</span> again to Save
            </h3>
        )
    } else {
        return <h3 className={"peak-message-header animate__animated animate__fadeIn"}>{pickText(saving, editing)}</h3>
    }
}

const HeaderIcon = ({ editing, saving, sendDeletePageMessage, goBack }) => {
    if (saving === SUBMISSION_STATE.Saving || saving === SUBMISSION_STATE.MetadataSaved) {
        return null
    } else if (editing === EDITING_STATE.Editing) {
        return <GoBackButton goBack={goBack} />
    } else {
        return <UndoCloseButton deleteBookmark={sendDeletePageMessage}/>
    }

}
