import * as React from "react";
import {useEffect, useMemo, useState} from "react";
import {Divider, Input} from "antd";
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
import {SavingAnimation, SavingSkeleton} from "../../../save-note-modal/saving-animation/SavingAnimation";

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

    // return (
    //     <div className={"peak-message-content-container"}>
    //         <Divider className={"peak-extension-divider"}/>
    //         <SavingSkeleton/>
    //     </div>
    // )
    if (saving === SUBMISSION_STATE.Saving || saving === SUBMISSION_STATE.MetadataSaved) {
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
    const { editingState, body, updateThatBody, editor, tabId } = props

    const openEditor = () => {
        updateMessageInPlace(tabId, { editingState: EDITING_STATE.Editing })
    }

    if (editingState === EDITING_STATE.Editing) {
        return (
            <div className={"peak-extension-row-container editor"}>
                <SaveNoteEditor content={body} setContent={updateThatBody} editor={editor}/>
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
                <span>Press <span className="hotkey-decoration">⌘ + ⇧ + S</span> again to Save</span>
            </div>
        </>
    )
}
