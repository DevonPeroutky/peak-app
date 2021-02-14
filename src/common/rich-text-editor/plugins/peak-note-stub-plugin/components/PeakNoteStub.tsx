import React from "react";
import {RenderElementProps} from "slate-react";
import cn from 'classnames';
import {ReadOutlined} from "@ant-design/icons/lib";
import "./peak-note-stub.scss"

export const PeakNoteStub = (props: RenderElementProps) => {
    return (
        <div className={cn("peak-note-stub-container")} {...props.attributes} key={0} tabIndex={0}>
            <div className={"peak-note-stub-title-row"} contentEditable={false}>
                <ReadOutlined className={"title-row-icon book"}/>
                <span className={"knowledge-label"}>Read something</span>
            </div>
            {props.children}
        </div>
    )
}

