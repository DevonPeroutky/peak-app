import * as React from "react";
import {Input} from "antd";
import {useMemo, useState} from "react";
import {openEditingNotification, openSavedPageMessage, SavedPageProps} from "../../SavePageMessage";
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
    const { editing } = props
    const [body, setBody] = useState<Node[]>(INITIAL_PAGE_STATE.body as Node[])

    // @ts-ignore
    const editor: ReactEditor = useMemo(() => pipe(createEditor(), ...chromeExtensionNormalizers), []);

    const updateThatBody = (newBod: Node[]) => {
        setBody(newBod)
        // syncCurrentDrawerState(tabId, userId, selectedTags, editedPageTitle, pageUrl, favIconUrl, newBod)
    }


    if (editing) {
        return (<SaveNoteEditor content={body} setContent={updateThatBody} editor={editor}/>)
    } else {
        return (
            <div onClick={() => openEditingNotification(props)} className={"add-note-button"}>
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
