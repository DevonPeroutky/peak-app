import {CloseOutlined, DeleteOutlined} from "@ant-design/icons/lib";
import cn from "classnames";
import React from "react";
import "./undo-close-button.scss"

export const UndoCloseButton = (props: { deleteBookmark: () => void }) => {
    const { deleteBookmark } = props

    return (
        <DeleteOutlined
            className={cn("peak-undo-icon animate__animated animate__fadeIn")}
            onClick={(e) => {
                e.preventDefault()
                deleteBookmark()
        }}/>
    )
}

export const NullButton = (props) => <div className="no-peak-undo-icon"/>
export const GoBackButton = (props: { goBack: () => void }) => {
    return (<CloseOutlined className={"peak-go-back-icon animate__animated animate__fadeIn"} onClick={() => props.goBack()}/>)
}
