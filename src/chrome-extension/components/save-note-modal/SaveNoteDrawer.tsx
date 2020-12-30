import {Button, Divider, Drawer, Input} from "antd";
import React, {useState} from "react";
import 'antd/lib/modal/style/index.css';
import 'antd/lib/drawer/style/index.css';
import 'antd/lib/divider/style/index.css';
import {PeakTag} from "../../../redux/slices/tagSlice";
import {Peaker} from "../../../redux/slices/userSlice";
import "./save-note-modal.scss"
import cn from "classnames";
import {SaveNoteEditor} from "./save-note-editor/SaveNoteEditor";
import {TagSelect} from "../../../common/rich-text-editor/plugins/peak-knowledge-plugin/components/peak-knowledge-node/peak-tag-select/component/PeakTagSelect";
import { CheckOutlined } from "@ant-design/icons";

export interface SaveNoteDrawerProps {
    user: Peaker
    pageTitle: string
    pageUrl: string
    favIconUrl: string
    tags: PeakTag[]
    visible: boolean
    closeDrawer: () => void
}
export const SaveNoteDrawer = (props: SaveNoteDrawerProps) => {
    const { tags, closeDrawer, visible, pageTitle, favIconUrl } = props
    const [currentTags, setTags] = useState<PeakTag[]>(tags || [])

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
                <SaveNoteEditor/>
                <Divider/>
                <div className="peak-note-drawer-footer">
                    <TagSelect selected_tags={[]} existing_tags={tags}/>
                    <Button type={"primary"} shape={"round"} icon={<CheckOutlined/>} onClick={() => console.log(`SUBMIT THIS BITCH`)}>Save Note...</Button>
                </div>
            </div>
        </Drawer>
    )
}

const DrawerTitle = (props) => {
    const baseUrl = chrome.runtime.getURL("../../../assets/logos/grayscale-with-sun.svg")
    return (
        <div className={"drawer-title-row"}>
            <img className={cn("peak-chrome-ext-logo")} src={baseUrl} alt={"Peak"}/>
            <span>Save this page</span>
        </div>
    )
}

const PageTitle = (props: {pageTitle: string, favIconUrl: string}) => {
    const { pageTitle, favIconUrl } = props
    return (
        <div className={"page-peak-note-title-container"}>
            <img className={"page-peak-favicon"} src={favIconUrl}/>
            <Input className={"page-peak-title-input"} bordered={false} defaultValue={pageTitle}/>
        </div>
    )
}