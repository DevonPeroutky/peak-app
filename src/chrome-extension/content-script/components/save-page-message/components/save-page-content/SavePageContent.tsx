import * as React from "react";
import {useEffect, useMemo, useState} from "react";
import {Divider, Input} from "antd";
import {SavedPageProps} from "../../SavePageMessage";
import {PlusOutlined, TagsOutlined} from "@ant-design/icons/lib";
import {TagSelect} from "../../../../../../common/rich-text-editor/plugins/peak-knowledge-plugin/components/peak-knowledge-node/peak-tag-select/component/ChromeExtensionTagSelect";
import {PeakTag} from "../../../../../../types";
import "./save-page-content.scss"
import {Node} from "slate";
import {INITIAL_PAGE_STATE} from "../../../../../../constants/editor";
import {PeakLogo} from "../../../../../../common/logo/PeakLogo";
import {EDITING_STATE, FOCUS_STATE, SUBMISSION_STATE} from "../../../../../constants/constants";
import {sendSubmitNoteMessage, updateMessageInPlace} from "../../../../utils/messageUtils";
import {PageSavingAnimation} from "../page-saving-animation/PageSavingAnimation";
import {STUB_TAG_ID} from "../../../../../../redux/slices/tags/types";
import {PeakEditor} from "../../../../../../common/rich-text-editor/editorFactory";
import {CHROME_EXTENSION} from "../../../../../../common/rich-text-editor/editors/chrome-extension/constants";
import {SaveNoteEditor} from "./save-note-editor/SaveNoteEditor";

interface SavePageContentProps extends SavedPageProps { };
interface SavePageContentBodyProps extends SavedPageProps { body: Node[], updateThatBody: (n: Node[]) => void };

export const SavePageContent = (props: SavePageContentProps) => {
    const { editingState, saving, userId, pageTitle, tags, nodesToAppend, shouldSubmit, pageUrl, favIconUrl, tabId } = props

    const [body, setBody] = useState<Node[]>(INITIAL_PAGE_STATE.body as Node[])
    const [editedPageTitle, setPageTitle] = useState<string>(pageTitle)
    const [selectedTags, setSelectedTags] = useState<PeakTag[]>([])


    const isEmpty = () => {
        return JSON.stringify(body) === JSON.stringify(INITIAL_PAGE_STATE.body)
    }

    // TODO: Add this back in.
    // Update the body from a user highlighting to add as quote.
    // useEffect(() => {
    //     const editorHasFocus: boolean = ReactEditor.isFocused(editor)
    //     if (nodesToAppend && !editorHasFocus) {
    //         if (isEmpty()) {
    //             updateThatBody([{children: nodesToAppend}])
    //         } else {
    //             const newBodyChildren: Node[] = (body[0].children as Node[]).concat(nodesToAppend)
    //             updateThatBody([{children: newBodyChildren}])
    //         }
    //     }
    // }, [nodesToAppend])

    const updateThatBody = (newBod: Node[]) => {
        setBody(newBod)
        // TODO: debounce this
        // REAL TODO: DO WE EVEN NEED THIS????
        // syncCurrentDrawerState(tabId, userId, selectedTags, editedPageTitle, pageUrl, favIconUrl, newBod)
    }

    useEffect(() => {
        if (shouldSubmit) {
            selectedTags.find(tag => tag.id === STUB_TAG_ID && tags)

            // For tags that were just created, we need to swap out their stubs with the corresponding created PeakTag
            // to avoid duplicate creation
            const tagsToAttach: PeakTag[] = selectedTags.map(t => {
                if (t.id !== STUB_TAG_ID) { return t }
                else {
                    const newlyCreated: PeakTag | undefined = tags.find(tag => tag.title === t.title)
                    return newlyCreated || t
                }
            })
            sendSubmitNoteMessage(tabId, userId, tagsToAttach, editedPageTitle, pageUrl, favIconUrl, body)
        }
    }, [shouldSubmit])

    if (saving === SUBMISSION_STATE.Saving || saving === SUBMISSION_STATE.MetadataSaved) {
        return <PageSavingAnimation saving={saving} editingState={editingState} tabId={tabId}/>
    }

    const propsWithBody = {...props, body: body, updateThatBody: updateThatBody}
    return (
        <div className={"peak-message-content-container animate__animated animate__fadeIn"}>
            <Divider className={"peak-extension-divider"}/>
            <PageTitle tabId={tabId} editedPageTitle={editedPageTitle} setPageTitle={setPageTitle} favIconUrl={favIconUrl}/>
            <Divider className={"peak-extension-divider"}/>
            <PageNoteBody {...propsWithBody}/>
            <Divider className={"peak-extension-divider"}/>
            <PeakTagSection tabId={tabId} selectedTags={selectedTags} existingTags={tags} setSelectedTags={setSelectedTags} saving={saving}/>
            <PeakDrawerFooter editing={editingState}/>
        </div>
    )
}

const PageTitle = (props: { tabId: number, editedPageTitle: string, setPageTitle: (newPageTitle: string) => void, favIconUrl: string}) => {
    const { tabId, editedPageTitle, setPageTitle, favIconUrl } = props
    const baseUrl = chrome.runtime.getURL("../../../assets/icons/bookmark.svg")

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPageTitle(e.target.value)
    }

    return (
        <div className={"peak-extension-row-container title"}>
            <img className={"page-peak-favicon"} src={favIconUrl || baseUrl}/>
            <Input
                onBlur={() => {
                    updateMessageInPlace(tabId, { focusState: FOCUS_STATE.NotFocused })
                }}
                onFocus={() => {
                    updateMessageInPlace(tabId, { focusState: FOCUS_STATE.Focus })
                }}
                className={"page-peak-title-input"}
                bordered={false}
                value={editedPageTitle}
                onChange={onChange}/>
            <span className={"underline-animation"}/>
        </div>
    )
}

const PageNoteBody = (props: SavePageContentBodyProps) => {
    const { editingState, body, updateThatBody, tabId } = props

    const openEditor = () => {
        updateMessageInPlace(tabId, { editingState: EDITING_STATE.Editing })
    }

    if (editingState === EDITING_STATE.Editing) {
        return (
            <div className={"peak-extension-row-container editor"}>
                <SaveNoteEditor onChange={updateThatBody} initialValue={body}/>
            </div>
        )
    } else {
        return (
            <div onClick={openEditor} className={"peak-extension-row-container add-note-button"}>
                <PlusOutlined className="peak-message-icon" /> Add notes...
            </div>
        )
    }
}

const PeakTagSection = ({tabId, selectedTags, existingTags, setSelectedTags, saving} ) => {
    return (
        <div className="peak-extension-row-container tag-section">
            <TagsOutlined/>
            <TagSelect tabId={tabId} selected_tags={selectedTags} existing_tags={existingTags} setSelectedTags={setSelectedTags} forceClose={saving === SUBMISSION_STATE.Saving}/>
        </div>
    )
}

const PeakDrawerFooter = ({editing}) => {
    if (editing !== EDITING_STATE.Editing) {
        return null
    }
    return (
        <>
            <Divider className={"peak-extension-divider"}/>
            <div className={"peak-extension-row-container footer"}>
                <PeakLogo/>
                <span>Press <span className="peak-hotkey-decoration">⌘ + ⇧ + S</span> again to Save</span>
            </div>
        </>
    )
}
