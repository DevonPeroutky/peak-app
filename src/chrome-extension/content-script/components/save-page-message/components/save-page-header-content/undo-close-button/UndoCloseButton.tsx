import {DeleteOutlined} from "@ant-design/icons/lib";
import cn from "classnames";
import React from "react";
import "./undo-close-button.scss"

export const UndoCloseButton = (props: { tabId: number }) => {
    const deleteBookmark = () => {
        console.log(`IMPLEMENT THIS DICK`)
    }

    return (
        <DeleteOutlined
            className={cn("peak-undo-icon")}
            onClick={(e) => {
                e.preventDefault()
                deleteBookmark()
        }}/>
    )
}
