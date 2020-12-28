import {Drawer} from "antd";
import React, {useState} from "react";
import 'antd/lib/modal/style/index.css';
import 'antd/lib/drawer/style/index.css';
import {PeakTag} from "../../../redux/slices/tagSlice";
import {Peaker} from "../../../redux/slices/userSlice";
import {closeDrawer} from "../../utils/stateUtils";
import "./save-note-modal.scss"

export interface SaveNoteDrawerProps {
    user: Peaker
    tags: PeakTag[]
    visible: boolean
}
export const SaveNoteDrawer = (props: SaveNoteDrawerProps) => {
    const { user, tags, visible} = props
    const [currentTags, setTags] = useState<PeakTag[]>(tags)

    console.log(`VISIBLE: ${visible}`)

    return (
        <Drawer
            title="Basic Drawer"
            className="peak-note-drawer"
            placement="right"
            closable={true}
            onClose={closeDrawer}
            keyboard={true}
            maskClosable={false}
            mask={false}
            destroyOnClose={true}
            visible={visible}
        >
            <p>Some contents...</p>
            {currentTags.map(t => <span key={t.id}>{t.title}</span>)}
        </Drawer>
    )
}