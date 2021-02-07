import React from 'react'
import {useCurrentNote} from "../../../client/notes";
import {PeakNote} from "../../../redux/slices/noteSlice";
import {Link, useHistory} from "react-router-dom";
import {CaretLeftFilled, CaretRightFilled} from "@ant-design/icons/lib";
import "./note-view.scss"
import {ELEMENT_WEB_NOTE} from "../../../common/rich-text-editor/plugins/peak-knowledge-plugin/constants";
import {capitalize_and_truncate} from "../../../utils/strings";
import {PeakNoteEditor} from "./note-editor/PeakNoteEditor";
import {Divider} from "antd";

export const PeakNoteView = (props) => {
    const history = useHistory()
    const currentNote: PeakNote | undefined = useCurrentNote()
    if (!currentNote) {
        history.push(`/home/journal`)
    }

    console.log(`CURRENT NOTE`, currentNote)

    return (
        <div className={"peak-note-view-container"}>
            {(currentNote.note_type === ELEMENT_WEB_NOTE) ? <WebNoteHeaderSection note={currentNote}/> : <BookHeaderSection note={currentNote}/>}
            <Divider className={"note-divider"}/>
            <PeakNoteEditor/>
        </div>
    )
}

const WebNoteHeaderSection = (props: {note: PeakNote}) => {
    const { note } = props
    console.log(`Note`, note)
    const url = new URL(note.url);
    const authorUrl = new URL(note.author);
    const urlDomain: string = url.hostname.split('.').slice(0, -1).join(" ");

    return (
        <div className={"note-header-section web_note"}>
            <div className={"note-subheader-section"}>
                <Link to={`/home/notes`}><CaretLeftFilled/> Back to notes</Link>
                <a href={note.url} target={"_blank"} className={"note-link-container"}>
                    <img className={"note-web-icon"} src={note.icon_url}/>
                    <span className={"note-url"}>{`${capitalize_and_truncate(urlDomain)}`} <CaretRightFilled/></span>
                </a>
            </div>
            <div className={"note-header-row"}>
                <h1>{capitalize_and_truncate(note.title, 45)}</h1>
            </div>
        </div>
    )
}
const BookHeaderSection = (props: {note: PeakNote}) => {
    const { note } = props
    return (
        <div className={"note-header-section peak_book"}>
            <div className={"note-subheader-section"}>
                <Link to={`/home/notes`}><CaretLeftFilled/> Back to Notes</Link>
            </div>
            <div className={"note-header-row"}>
                <>
                    <img src={note.icon_url}/>
                    <h1>{capitalize_and_truncate(note.title, 35)}</h1>
                </>
                <span>{note.author}</span>
            </div>
        </div>
    )
}
