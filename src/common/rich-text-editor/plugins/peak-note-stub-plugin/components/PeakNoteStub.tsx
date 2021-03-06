import React from "react";
import {RenderElementProps} from "slate-react";
import cn from 'classnames';
import { EditTwoTone, FireTwoTone, ReadOutlined } from "@ant-design/icons/lib";
import "./peak-note-stub.scss"
import {Link} from "react-router-dom";
import {capitalize_and_truncate} from "../../../../../utils/strings";
import {buildNoteUrl} from "../../../../../utils/notes";

export const PeakNoteStub = (props: RenderElementProps) => {
    const { element } = props
    return (
        <div className={cn("peak-note-stub-container")} {...props.attributes} key={0} tabIndex={0} contentEditable={false}>
            <div className={"peak-note-stub-title-row"} >
                <span className={"knowledge-label"}>
                    {element.action === 'created' ? <CreatedStub/> : <AddedStub/>}
                    <ReadOutlined className={"title-row-icon book"}/>
                    <Link to={buildNoteUrl(element.note_id as string)} className={"link-to-note"}>{capitalize_and_truncate(element.title as string, 100)}</Link>
                    {(element.author) ? `by ${capitalize_and_truncate(element.author as string, 30)}` : ""}
                </span>
            </div>
            <div style={{ height: 0, overflow: "hidden" }}>{props.children}</div>
        </div>
    )
}

const CreatedStub = (props) => {
   return (
       <span>
           <FireTwoTone className={"edit-icon"}/>Started Reading
       </span>
   )
}
const AddedStub = (props) => {
    return (
        <span>
           <EditTwoTone className={"edit-icon"}/>Added notes to
       </span>
    )
}

