import {ArrowLeftOutlined, CloseOutlined, DeleteOutlined} from "@ant-design/icons/lib";
import cn from "classnames";
import React from "react";
import "./undo-close-button.scss"

export const UndoCloseButton = (props: { deleteBookmark: () => void }) => {
    const { deleteBookmark } = props

    return (
        <DeleteOutlined
            className={cn("peak-undo-icon ")}
            onClick={(e) => {
                e.preventDefault()
                deleteBookmark()
        }}/>
    )
}

export const NullButton = (props) => <div className="no-peak-undo-icon"/>
export const GoBackButton = (props: { goBack: () => void }) => {
    return (<ArrowLeftOutlined className={"peak-go-back-icon"} onClick={() => props.goBack()}/>)
}

