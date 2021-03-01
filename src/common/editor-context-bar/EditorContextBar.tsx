import React from "react"
import {HelpModal} from "../modals/help-modal/HelpModal";
import "./editor-context-bar.scss"
import {useCurrentPage} from "../../utils/hooks";
import {CheckOutlined} from "@ant-design/icons/lib";
import {useActiveEditorState} from "../../redux/slices/activeEditor/activeEditorSlice";


export const EditorContextBar = (props: {}) => {
    return (
        <div className={"editor-context-bar"}>
            <PageEditingContext/>
            <HelpModal/>
        </div>
    )
}

const PageEditingContext = (props: {}) => {
    const editorState = useActiveEditorState()
    console.log(`Current Editor State `, editorState)

    if (editorState && editorState.isSaving) {
        return (
            <span className={"editing-status"}>Saving...</span>
        )
    } else if (editorState && !editorState.isSaving) {
        return (
            <span className={"editing-status animate__animated animate__fadeOut saved"}>Saved <CheckOutlined className={"saved-check"}/></span>
        )
    } else {
        return null
    }
}
