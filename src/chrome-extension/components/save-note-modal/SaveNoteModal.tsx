import {Drawer} from "antd";
import React, {useState} from "react";
import 'antd/lib/modal/style/index.css';
import 'antd/lib/drawer/style/index.css';
import {PeakTag} from "../../../redux/slices/tagSlice";
import {Peaker} from "../../../redux/slices/userSlice";
import "./save-note-modal.scss"
import cn from "classnames";
// @ts-ignore
import logo from "../../../assets/logos/grayscale-with-sun.svg";

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
    const { tags, closeDrawer, visible } = props
    const [currentTags, setTags] = useState<PeakTag[]>(tags || [])

    console.log(`VISIBLE: ${visible}`)
    console.log(props)

    return (
        <Drawer
            title={<DrawerTitle/>}
            className="peak-note-drawer"
            placement="right"
            closable={true}
            onClose={closeDrawer}
            keyboard={true}
            maskClosable={false}
            mask={false}
            destroyOnClose={true}
            visible={visible || false}
        >
            <p>Some contents...</p>
            {currentTags.map(t => <span key={t.id}>{t.title}</span>)}
        </Drawer>
    )
}

const DrawerTitle = (props) => {
    const baseUrl = chrome.runtime.getURL("../../../assets/logos/grayscale-with-sun.svg")
    console.log(`THE URL ${baseUrl}`)
    return (
        <div>
            <div
                className={cn("peak-logo-wrapper")}>
                <img className={cn("peak-logo-img")} src={baseUrl} alt={"Peak"}/>
            </div>
            <span>Save this page</span>
        </div>
    )

}