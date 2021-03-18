import * as React from "react";
import {useEffect, useMemo, useState} from "react";
import {Input} from "antd";
import {openMessage, SavedPageProps} from "../../SavePageMessage";
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
import {EDITING_STATE} from "../../../../../constants/constants";

interface SavePageContentProps extends SavedPageProps { };

export const SavePageContent = (props: SavePageContentProps) => {
    const { editing, saving, pageTitle, tags } = props
    const [editedPageTitle, setPageTitle] = useState<string>(pageTitle)
    const [selectedTags, setSelectedTags] = useState<PeakTag[]>([])

    return (
        <div className={"peak-message-content-container"}>
            <PageTitle editedPageTitle={editedPageTitle} setPageTitle={setPageTitle} {...props}/>
            <PageNoteBody {...props}/>
            <div className="peak-message-tag-container">
                <TagsOutlined/>
                <TagSelect selected_tags={selectedTags} existing_tags={tags} setSelectedTags={setSelectedTags}/>
            </div>
            { (editing) ? <PeakDrawerFooter/> : null }
        </div>
    )
}

const PageTitle = (props: {editedPageTitle: string, setPageTitle: (newPageTitle: string) => void, favIconUrl: string, closeDrawer: () => void}) => {
    const { editedPageTitle, setPageTitle, favIconUrl, closeDrawer } = props
    const baseUrl = chrome.runtime.getURL("../../../assets/logos/grayscale-with-sun.svg")

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPageTitle(e.target.value)
    }

    return (
        <div className={"page-peak-note-title-container"}>
            <img className={"page-peak-favicon"} src={favIconUrl || baseUrl}/>
            <Input className={"page-peak-title-input"} bordered={false} value={editedPageTitle} onChange={onChange}/>
        </div>
    )
}

const PageNoteBody = (props: SavePageContentProps) => {
    const { editing, nodesToAppend } = props
    const [body, setBody] = useState<Node[]>(INITIAL_PAGE_STATE.body as Node[])
    // @ts-ignore
    const editor: ReactEditor = useMemo(() => pipe(createEditor(), ...chromeExtensionNormalizers), []);

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

    if (editing === EDITING_STATE.Editing) {
        return (<SaveNoteEditor content={body} setContent={updateThatBody} editor={editor}/>)
    } else {
        return (
            <div onClick={() => openMessage({...props, editing: EDITING_STATE.Editing})} className={"add-note-button"}>
                <PlusOutlined className="peak-message-icon" /> Add notes...
            </div>
        )
    }
}

const PeakDrawerFooter = (props) => {
    return (
        <div className={"peak-note-drawer-footer"}>
            <PeakLogo/>
            <span>Press <span className="hotkey-decoration">⌘ + ⇧ + S</span> again to Save</span>
        </div>
    )
}
