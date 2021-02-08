import React, {useState} from 'react'
import {useCurrentNote, useDebouncePeakNoteSaver} from "../../../client/notes";
import {PeakNote} from "../../../redux/slices/noteSlice";
import {Link, useHistory} from "react-router-dom";
import {CaretLeftFilled, CaretRightFilled, ReadOutlined} from "@ant-design/icons/lib";
import "./note-view.scss"
import {ELEMENT_WEB_NOTE} from "../../../common/rich-text-editor/plugins/peak-knowledge-plugin/constants";
import {capitalize_and_truncate} from "../../../utils/strings";
import {PeakNoteEditor} from "./note-editor/PeakNoteEditor";
import {Divider, Input} from "antd";
import {ImageLoader} from "../../../common/image-loader/ImageLoader";
import {useCurrentUser} from "../../../utils/hooks";

export const PeakNoteView = (props) => {
    const history = useHistory()
    const currentNote: PeakNote | undefined = useCurrentNote()
    if (!currentNote) {
        history.push(`/home/journal`)
    }

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
    const url = new URL(note.url);
    const urlDomain: string = url.hostname.split('.').slice(0, -1).join(" ");
    const [title, setTitle] = useState(note.title)
    const noteSaver = useDebouncePeakNoteSaver()
    const currentUser = useCurrentUser()

    const onTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value)
        noteSaver(currentUser.id, note.id, { title: e.target.value })
    }

    return (
        <div className={"note-header-section web_note"}>
            <div className={"note-subheader-section"}>
                <Link to={`/home/notes`} className={"note-link-container"}><CaretLeftFilled/> Back to notes</Link>
                <a href={note.url} target={"_blank"} className={"note-link-container"}>
                    <img className={"note-web-icon"} src={note.icon_url}/>
                    <span className={"note-url"}>{`${capitalize_and_truncate(urlDomain)}`} <CaretRightFilled/></span>
                </a>
            </div>
            <div className={"note-header-row"}>
                <Input className={"web-title-input"} bordered={false} onChange={onTitleChange} value={title}/>
            </div>
        </div>
    )
}
const BookHeaderSection = (props: {note: PeakNote}) => {
    const { note } = props
    const [title, setTitle] = useState(note.title)
    const [author, setAuthor] = useState(note.author)
    const noteSaver = useDebouncePeakNoteSaver()
    const currentUser = useCurrentUser()

    const onAuthorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAuthor(e.target.value)
        noteSaver(currentUser.id, note.id, { author: e.target.value })
    }
    const onTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value)
        noteSaver(currentUser.id, note.id, { title: e.target.value })
    }
    return (
        <div className={"note-header-section peak_book"}>
            <div className={"note-subheader-section"}>
                <Link to={`/home/notes`}><CaretLeftFilled/> Back to Notes</Link>
            </div>
            <div className={"book-note-header-row"}>
                <ImageLoader url={note.icon_url} className={"book-note-cover-image"} fallbackElement={<ReadOutlined className={"book-note-cover-image"}/>}/>
                <div className={"note-header"}>
                    <Input className={"book-title-input"} bordered={false} onChange={onTitleChange} value={title} placeholder="Add a book title"/>
                    <Input className={"author-subtitle"} bordered={false} onChange={onAuthorChange} value={author} placeholder="Add an Author"/>
                </div>
            </div>
        </div>
    )
}