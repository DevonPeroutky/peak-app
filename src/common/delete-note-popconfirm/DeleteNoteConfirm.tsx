import {message, Popconfirm} from "antd";
import {DeleteOutlined, QuestionCircleOutlined} from "@ant-design/icons/lib";
import React from "react";
import {PeakNote} from "../../redux/slices/noteSlice";
import "./delete-note-confirm.scss"

export const DeleteNoteConfirm = (props: { item: PeakNote }) => {
    const { item } = props
    const mockOut = () => {
        message.info("Not implemented yet")
    }
    return (
        <Popconfirm title="Are you sure？" icon={<QuestionCircleOutlined style={{ color: 'red' }}/>} onConfirm={mockOut}>
            <DeleteOutlined className={"confirm-delete-icon"}/>
        </Popconfirm>
    )
}
