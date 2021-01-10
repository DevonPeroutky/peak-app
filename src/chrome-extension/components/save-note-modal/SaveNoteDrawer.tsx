import {Drawer, Input, message} from "antd";
import React, {useState} from "react";
import 'antd/lib/modal/style/index.css';
import 'antd/lib/drawer/style/index.css';
import 'antd/lib/divider/style/index.css';
import 'antd/lib/select/style/index.css';
import 'antd/lib/input/style/index.css';
import 'antd/lib/dropdown/style/index.css';
import 'antd/lib/list/style/index.css';
import 'antd/lib/menu/style/index.css';
import 'antd/lib/icon/style/index.css';
import 'antd/lib/tag/style/index.css';
import 'antd/lib/auto-complete/style/index.css';
import 'antd/lib/empty/style/css';
import {PeakTag} from "../../../redux/slices/tagSlice";
import "./save-note-modal.scss"
import {SaveNoteEditor} from "./save-note-editor/SaveNoteEditor";
import { TagSelect } from "../../../common/rich-text-editor/plugins/peak-knowledge-plugin/components/peak-knowledge-node/peak-tag-select/component/PeakTagSelect";
import {Node} from "slate";
import {INITIAL_PAGE_STATE} from "../../../redux/slices/wikiPageSlice";
import {sendSubmitNoteMessage} from "../../content-script/content";
import {TagsOutlined} from "@ant-design/icons/lib";
import {PeakLogo} from "../../../common/logo/PeakLogo";

export interface SaveNoteDrawerProps {
    userId: string
    tabId: number
    pageTitle: string
    pageUrl: string
    favIconUrl: string
    tags: PeakTag[]
    visible: boolean
    closeDrawer: () => void
}
export const SaveNoteDrawer = (props: SaveNoteDrawerProps) => {
    const { tabId, userId, tags, closeDrawer, visible, pageTitle, favIconUrl, pageUrl } = props
    const [body, setBody] = useState<Node[]>(INITIAL_PAGE_STATE.body as Node[])
    const [selectedTags, setSelectedTags] = useState<PeakTag[]>([])

    const closeDrawerOnSuccess = (response) => {
        console.log(`THE RESPONSE`)
        console.log(response)
        if (!response) {
            message.error("Unable to save your note. Tell Devon.")
        } else {
            message.success("Saved!")
        }
        closeDrawer()
    }

    const sendSubmitMessage = () => {
        sendSubmitNoteMessage(tabId, userId, selectedTags, pageTitle, pageUrl, favIconUrl, body, closeDrawerOnSuccess)
    }

    return (
        <Drawer
            title={<PageTitle {...props}/>}
            className="peak-note-drawer"
            placement="right"
            closable={false}
            onClose={closeDrawer}
            keyboard={true}
            width={"300px"}
            maskClosable={false}
            mask={false}
            destroyOnClose={true}
            visible={visible || false}
        >
            <>
                <div className="peak-note-drawer-body">
                    <SaveNoteEditor content={body} setContent={setBody}/>
                    <div className="peak-note-drawer-tag-section">
                        <h2 className="peak-note-drawer-header">Tags</h2>
                        <div className="peak-note-tag-section-container">
                            <TagsOutlined/>
                            <TagSelect selected_tags={selectedTags} existing_tags={tags} setSelectedTags={setSelectedTags}/>
                        </div>
                        {/*<Button type={"primary"} shape={"round"} icon={<CheckOutlined/>} onClick={sendSubmitMessage}>Save Note...</Button>*/}
                    </div>
                </div>
                <div className={"peak-note-drawer-footer"}>
                    <PeakLogo/>
                    <span>Press <span className="hotkey-decoration">⌘ + ⇧ + S</span> again to Save</span>
                </div>
            </>
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