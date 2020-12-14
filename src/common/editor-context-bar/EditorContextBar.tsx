import React from "react"
import {HelpModal} from "../modals/help-modal/HelpModal";
import "./editor-context-bar.scss"
import {useCurrentWikiPage} from "../../utils/hooks";
import {CheckOutlined} from "@ant-design/icons/lib";


export const EditorContextBar = (props: {}) => {
    return (
        <div className={"editor-context-bar"}>
            <PageEditingContext/>
            <HelpModal/>
        </div>
    )
}

const PageEditingContext = (props: {}) => {
    const currentPage = useCurrentWikiPage()

    if (currentPage && currentPage.isSaving) {
        return (
            <span className={"editing-status"}>Saving...</span>
        )
    } else if (currentPage && !currentPage.isSaving) {
        return (
            <span className={"editing-status animated fadeOut saved"}>Saved <CheckOutlined className={"saved-check"}/></span>
        )
    } else {
        return null
    }
}
