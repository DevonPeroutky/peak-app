import {DeleteOutlined} from "@ant-design/icons/lib";
import cn from "classnames";
import React from "react";
import "./undo-close-button.scss"

export const UndoCloseButton = (props: { }) => {
    const deleteBookmark = () => {
        console.log(`IMPLEMENT THIS DICK`)
    }

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