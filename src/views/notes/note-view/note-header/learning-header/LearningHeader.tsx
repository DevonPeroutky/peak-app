import {PeakNote} from "../../../../../redux/slices/noteSlice";
import {PeakTag} from "../../../../../types";
import {Link} from "react-router-dom";
import {CaretLeftFilled, CaretRightFilled} from "@ant-design/icons/lib";
import TextArea from "antd/es/input/TextArea";
import {NoteTagSelect} from "../../../../../common/rich-text-editor/plugins/peak-knowledge-plugin/components/peak-knowledge-node/peak-tag-select/component/NoteTagSelect";
import React from "react";

export const LearningHeaderSection = (props: {note: PeakNote, title: string, onTitleChange: (e) => void, selected_tags: PeakTag[]}) => {
    const { note, selected_tags, onTitleChange, title } = props


    console.log(`TITLE? `, title === "Untitled" )
    console.log(`TITLE:`, title)

    return (
        <div className={"note-header-section web_note"}>
            <div className={"note-subheader-section"}>
                <Link to={`/home/notes`} className={"note-link-container"}><CaretLeftFilled/> Back to notes</Link>
            </div>
            <div className={"note-header-row"}>
                <TextArea
                    className={"web-title-input"}
                    placeholder={"Give your note a Title"}
                    bordered={false}
                    onChange={onTitleChange}
                    autoSize={{minRows: 1, maxRows: 8}}
                    value={(title === "untitled") ? "" : title}/>
                <NoteTagSelect selected_tags={selected_tags} note_id={note.id}/>
            </div>
        </div>
    )
}
