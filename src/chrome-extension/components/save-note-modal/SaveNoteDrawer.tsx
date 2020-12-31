import {Button, Divider, Drawer, Input, message} from "antd";
import React, {useState} from "react";
import 'antd/lib/modal/style/index.css';
import 'antd/lib/drawer/style/index.css';
import 'antd/lib/divider/style/index.css';
import {PeakTag} from "../../../redux/slices/tagSlice";
import "./save-note-modal.scss"
import {SaveNoteEditor} from "./save-note-editor/SaveNoteEditor";
import { TagSelect } from "../../../common/rich-text-editor/plugins/peak-knowledge-plugin/components/peak-knowledge-node/peak-tag-select/component/PeakTagSelect";
import { CheckOutlined } from "@ant-design/icons";
import {createWebNoteRequest} from "../../../client/webNotes";
import {futureCreatePeakTags} from "../../../client/tags";
import {Node} from "slate";
import {INITIAL_PAGE_STATE} from "../../../redux/slices/wikiPageSlice";

export interface SaveNoteDrawerProps {
    userId: string
    pageTitle: string
    pageUrl: string
    favIconUrl: string
    tags: PeakTag[]
    visible: boolean
    closeDrawer: () => void
}
export const SaveNoteDrawer = (props: SaveNoteDrawerProps) => {
    const { userId, tags, closeDrawer, visible, pageTitle, favIconUrl, pageUrl } = props
    const [body, setBody] = useState<Node[]>(INITIAL_PAGE_STATE.body as Node[])
    const [selectedTags, setSelectedTags] = useState<PeakTag[]>([])

    const onSubmit = () => {
        futureCreatePeakTags(userId, selectedTags).catch(res => {
            message.warn("Failed to create the new tags. Let Devon know")
        })

        const newWebNote = { "title": pageTitle, "url": pageUrl, favIconUrl, body}
        createWebNoteRequest(userId, newWebNote, selectedTags).then(res => {
            message.success("Saved your note!")
        }).then(res => {
            closeDrawer()
        })
    }

    return (
        <Drawer
            title={<PageTitle {...props}/>}
            className="peak-note-drawer"
            placement="right"
            closable={true}
            onClose={closeDrawer}
            keyboard={true}
            width={"300px"}
            maskClosable={false}
            mask={false}
            destroyOnClose={true}
            visible={visible || false}
        >
            <div className="peak-note-drawer-body">
                <SaveNoteEditor content={body} setContent={setBody}/>
                <Divider/>
                <div className="peak-note-drawer-footer">
                    <TagSelect selected_tags={selectedTags} existing_tags={tags} setSelectedTags={setSelectedTags}/>
                    <Button type={"primary"} shape={"round"} icon={<CheckOutlined/>} onClick={onSubmit}>Save Note...</Button>
                </div>
            </div>
        </Drawer>
    )
}

const PageTitle = (props: {pageTitle: string, favIconUrl: string}) => {
    const { pageTitle, favIconUrl } = props
    const baseUrl = chrome.runtime.getURL("../../../assets/logos/grayscale-with-sun.svg")
    return (
        <div className={"page-peak-note-title-container"}>
            <img className={"page-peak-favicon"} src={favIconUrl || baseUrl}/>
            <Input className={"page-peak-title-input"} bordered={false} defaultValue={pageTitle}/>
        </div>
    )
}