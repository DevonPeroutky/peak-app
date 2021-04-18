import {message, Popconfirm} from "antd";
import {DeleteOutlined} from "@ant-design/icons/lib";
import React, { useState } from "react";
import {PeakNote} from "../../redux/slices/noteSlice";
import "./delete-note-confirm.scss"
import { deletePeakNote } from "src/client/notes";

export const DeleteNoteConfirm = (props: { item: PeakNote }) => {
    const { item } = props
    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(false);

    const close = () => {
        setVisible(false);
    };

    const open = () => {
        setVisible(true);
    }

    const deleteNote = (e) => {
        setLoading(true)
        setTimeout(() => {
            deletePeakNote(item.user_id, item.id).catch(err => {
                setLoading(false)
                message.error("Failed to delete your note due to a server error.")
            }).finally(close)
        }, 500);
    }
    return (
        <Popconfirm
            title="Are you sure"
            visible={visible}
            onConfirm={deleteNote}
            onCancel={close}
            okButtonProps={{ loading: loading }}
            okText={"Delete"}>

            <DeleteOutlined className={"confirm-delete-icon"} onClick={open}/>
        </Popconfirm>
    )
}
