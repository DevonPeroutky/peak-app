import {Drawer} from "antd";
import React, {useState} from "react";
import 'antd/lib/modal/style/index.css';
import 'antd/lib/drawer/style/index.css';
import {PeakTag} from "../../../redux/slices/tagSlice";
import {Peaker} from "../../../redux/slices/userSlice";
import "./save-note-modal.scss"
import {ChromeExtensionPeakLogo, PeakLogo} from "../../../common/logo/PeakLogo";

export interface SaveNoteDrawerProps {
    user: Peaker
    pageTitle: string
    url: string
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
    return (
        <div>
            <ChromeExtensionPeakLogo/>
            <span>Save this page</span>
        </div>
    )

}