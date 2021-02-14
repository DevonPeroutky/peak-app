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
import {NoteTagSelect} from "../../../common/rich-text-editor/plugins/peak-knowledge-plugin/components/peak-knowledge-node/peak-tag-select/component/NoteTagSelect";
import {useLoadTags} from "../../../utils/notes";
import {PeakTag} from "../../../types";

export const PeakNoteView = (props) => {
    const history = useHistory()
    const currentNote: PeakNote | undefined = useCurrentNote()

    const noteSaver = useDebouncePeakNoteSaver()
    const currentUser = useCurrentUser()
    const selected_tags: PeakTag[] = useLoadTags(currentNote.tag_ids)
    const [title, setTitle] = useState(currentNote.title)
    const [author, setAuthor] = useState(currentNote.author)

    const onTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value)
        noteSaver(currentUser.id, currentNote.id, { title: e.target.value })
    }

    const onAuthorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAuthor(e.target.value)
        noteSaver(currentUser.id, currentNote.id, { author: e.target.value })
    }

    if (!currentNote) {
        history.push(`/home/journal`)
    }

    return (
        <div className={"peak-note-view-container"}>
            {(currentNote.note_type === ELEMENT_WEB_NOTE) ?
                <WebNoteHeaderSection
                    note={currentNote}
                    title={title}
                    onTitleChange={onTitleChange}
                    selected_tags={selected_tags}/>
                : <BookHeaderSection
                    title={title}
                    onTitleChange={onTitleChange}
                    author={author}
                    onAuthorChange={onAuthorChange}
                    note_id={currentNote.id}
                    icon_url={currentNote.icon_url}
                    selected_tags={selected_tags}/>
            }
            <Divider className={"note-divider"}/>
            <PeakNoteEditor note_id={currentNote.id}/>
        </div>
    )
}

const WebNoteHeaderSection = (props: {note: PeakNote, title: string, onTitleChange: (e) => void, selected_tags: PeakTag[]}) => {
    const { note, selected_tags, onTitleChange, title } = props
    const url = new URL(note.url);
    const urlDomain: string = url.hostname.split('.').slice(0, -1).join(" ");

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
                <NoteTagSelect selected_tags={selected_tags} note_id={note.id}/>
            </div>
        </div>
    )
}
export const BookHeaderSection = (props: {note_id: string, icon_url: string, selected_tags: PeakTag[], title: string, author: string, onAuthorChange, onTitleChange}) => {
    const { note_id, icon_url, title, author, onAuthorChange, onTitleChange, selected_tags } = props
    return (
        <div className={"note-header-section peak_book"}>
            <div className={"note-subheader-section"}>
                <Link to={`/home/notes`}><CaretLeftFilled/> Back to Notes</Link>
            </div>
            <div className={"book-note-header-row"}>
                <ImageLoader url={icon_url} className={"book-note-cover-image"} fallbackElement={<ReadOutlined className={"book-note-cover-image"}/>}/>
                <div className={"note-header"}>
                    <Input className={"book-title-input"} bordered={false} onChange={onTitleChange} value={title} placeholder="Add a book title"/>
                    <Input className={"author-subtitle"} bordered={false} onChange={onAuthorChange} value={author} placeholder="Add an Author"/>
                    <NoteTagSelect selected_tags={selected_tags} note_id={note_id}/>
                </div>
            </div>
        </div>
    )
}
