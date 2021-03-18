import * as React from "react";
import "./save-page-content.scss"
import {Input} from "antd";
import {useState} from "react";
import {SavedPageProps} from "../../SavePageMessage";
import {SaveNoteEditor} from "../../../save-note-modal/save-note-editor/SaveNoteEditor";
import {TagsOutlined} from "@ant-design/icons/lib";
import {TagSelect} from "../../../../../../common/rich-text-editor/plugins/peak-knowledge-plugin/components/peak-knowledge-node/peak-tag-select/component/ChromeExtensionTagSelect";
import {PeakTag} from "../../../../../../types";

interface SavePageContentProps extends SavedPageProps { };

export const SavePageContent = (props: SavePageContentProps) => {
    const { editing, saving, pageTitle, tags } = props
    const [editedPageTitle, setPageTitle] = useState<string>(pageTitle)
    const [selectedTags, setSelectedTags] = useState<PeakTag[]>([])
    return (
        <div className={"peak-message-content-container"}>
            <PageTitle editedPageTitle={editedPageTitle} setPageTitle={setPageTitle} {...props}/>
            <div className={"peak-note-drawer-body"}>
                <div className="peak-note-drawer-tag-section">
                    <h2 className="peak-note-drawer-header">Tags</h2>
                    <div className="peak-note-tag-section-container">
                        <TagsOutlined/>
                        <TagSelect selected_tags={selectedTags} existing_tags={tags} setSelectedTags={setSelectedTags}/>
                    </div>
                </div>
            </div>
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
            {/*<SkippableCloseIcon closeDrawer={closeDrawer} />*/}
        </div>
    )
}

const SkippableCloseIcon = (props: { closeDrawer: () => void}) => {
    const { closeDrawer }  = props
    const baseUrl = chrome.runtime.getURL("../../../assets/icons/gray-close.svg")
    return (
        <>
            <img className={"peak-close-icon"} src={baseUrl} onClick={closeDrawer}/>
        </>
    )
}
