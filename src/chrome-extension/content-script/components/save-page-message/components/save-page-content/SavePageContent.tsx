import * as React from "react";
import {useEffect, useMemo, useState} from "react";
import {Input, Select} from "antd";
import {closeMessage, SavedPageProps} from "../../SavePageMessage";
import {PlusOutlined, TagsOutlined} from "@ant-design/icons/lib";
import {TagSelect} from "../../../../../../common/rich-text-editor/plugins/peak-knowledge-plugin/components/peak-knowledge-node/peak-tag-select/component/ChromeExtensionTagSelect";
import {PeakTag} from "../../../../../../types";
import "./save-page-content.scss"
import {SaveNoteEditor} from "../../../save-note-modal/save-note-editor/SaveNoteEditor";
import {createEditor, Node} from "slate";
import {INITIAL_PAGE_STATE} from "../../../../../../constants/editor";
import {ReactEditor} from "slate-react";
import {pipe} from "@udecode/slate-plugins";
import {chromeExtensionNormalizers} from "../../../../../../common/rich-text-editor/editors/chrome-extension/config";
import {PeakLogo} from "../../../../../../common/logo/PeakLogo";
import {EDITING_STATE, FOCUS_STATE, SUBMISSION_STATE} from "../../../../../constants/constants";
import {sendSubmitNoteMessage, updateMessageInPlace} from "../../../../utils/messageUtils";
import {SavingAnimation} from "../../../save-note-modal/saving-animation/SavingAnimation";

interface SavePageContentProps extends SavedPageProps { };
interface SavePageContentBodyProps extends SavedPageProps { body: Node[], updateThatBody: (n: Node[]) => void, editor: ReactEditor };

export const SavePageContent = (props: SavePageContentProps) => {
    const { editingState, saving, userId, pageTitle, tags, nodesToAppend, shouldSubmit, pageUrl, favIconUrl, tabId } = props
    // @ts-ignore
    const editor: ReactEditor = useMemo(() => pipe(createEditor(), ...chromeExtensionNormalizers), []);
    const [body, setBody] = useState<Node[]>(INITIAL_PAGE_STATE.body as Node[])
    const [editedPageTitle, setPageTitle] = useState<string>(pageTitle)
    const [selectedTags, setSelectedTags] = useState<PeakTag[]>([])

    const isEmpty = () => {
        return JSON.stringify(body) === JSON.stringify(INITIAL_PAGE_STATE.body)
    }

    useEffect(() => {
        const editorHasFocus: boolean = ReactEditor.isFocused(editor)
        if (nodesToAppend && !editorHasFocus) {
            if (isEmpty()) {
                updateThatBody([{children: nodesToAppend}])
            } else {
                const newBodyChildren: Node[] = (body[0].children as Node[]).concat(nodesToAppend)
                updateThatBody([{children: newBodyChildren}])
            }
        }
    }, [nodesToAppend])

    const updateThatBody = (newBod: Node[]) => {
        setBody(newBod)
        // TODO: DEBOUNCE THIS
        // syncCurrentDrawerState(tabId, userId, selectedTags, editedPageTitle, pageUrl, favIconUrl, newBod)
    }

    useEffect(() => {
        if (shouldSubmit) {
            sendSubmitNoteMessage(tabId, userId, selectedTags, editedPageTitle, pageUrl, favIconUrl, body)
        }
    }, [shouldSubmit])

    const propsWithBody = {...props, body: body, updateThatBody: updateThatBody, editor: editor as ReactEditor}

    if ((saving === SUBMISSION_STATE.Saving || saving === SUBMISSION_STATE.MetadataSaved) && editingState === EDITING_STATE.Editing) {
        return (<SavingAnimation submittingState={saving} onComplete={() => closeMessage(tabId)}/>)
    }

    return (
        <div className={"peak-message-content-container"}>
            <PageTitle tabId={tabId} editedPageTitle={editedPageTitle} setPageTitle={setPageTitle} favIconUrl={favIconUrl}/>
            <PageNoteBody {...propsWithBody}/>
            <div className="peak-message-tag-container">
                <TagsOutlined/>
                <TagSelect tabId={tabId} selected_tags={selectedTags} existing_tags={tags} setSelectedTags={setSelectedTags} forceClose={saving === SUBMISSION_STATE.Saving}/>
            </div>
            { (editingState === EDITING_STATE.Editing) ? <PeakDrawerFooter/> : null }
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
        <div className={"page-peak-note-title-container"}>
            <img className={"page-peak-favicon"} src={favIconUrl || baseUrl}/>
            <Input
                onBlur={() => {
                    console.log(`Lost focus of the TItle`)
                    updateMessageInPlace(tabId, { focusState: FOCUS_STATE.NotFocused })
                }}
                onFocus={() => {
                    updateMessageInPlace(tabId, { focusState: FOCUS_STATE.Focus })
                }}
                className={"page-peak-title-input"}
                bordered={false}
                value={editedPageTitle}
                onChange={onChange}/>
        </div>
    )
}

const PageNoteBody = (props: SavePageContentBodyProps) => {
    const { editingState, body, updateThatBody, editor, tabId } = props

    const openEditor = () => {
        updateMessageInPlace(tabId, { editingState: EDITING_STATE.Editing })
    }

    if (editingState === EDITING_STATE.Editing) {
        return (<SaveNoteEditor content={body} setContent={updateThatBody} editor={editor}/>)
    } else {
        return (
            <div onClick={openEditor} className={"add-note-button"}>
                <PlusOutlined className="peak-message-icon" /> Add notes...
            </div>
        )
    }
}

const PeakDrawerFooter = (props) => {
    console.log(`RE-RENDERING THE FOOTER`)
    return (
        <div className={"peak-note-drawer-footer"}>
            <PeakLogo/>
            <span>Press <span className="hotkey-decoration">⌘ + ⇧ + S</span> again to Save</span>
        </div>
    )
}
