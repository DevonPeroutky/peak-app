import {RenderElementProps} from "slate-react";
import React from "react";
import {Node} from "slate";
import cn from "classnames";
import "./peak-title.scss"

export const PeakTitle = (props: RenderElementProps) => {
    const titleText: string = Node.string(props.element)
    return (
        <div className={"title-container"}>
            <div className={cn("peak-title", (!titleText) ? "empty-title" : "")} {...props}/>
        </div>
    )
}