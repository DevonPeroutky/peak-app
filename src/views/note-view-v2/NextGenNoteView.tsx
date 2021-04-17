import React, {useState} from 'react'
import {useCurrentNote, useDebouncePeakNoteSaver} from "../../client/notes";
import {Link, useHistory} from "react-router-dom";
import {PeakNoteEditor} from "../notes/note-view/note-editor/PeakNoteEditor";
import {useLoadTags} from "../../utils/tags";
import {useCurrentUser} from "../../utils/hooks";
import {PeakNote} from "../../redux/slices/noteSlice";
import {PeakTag} from "../../types";

export const NextGenNoteView = (props: { note: PeakNote }) => {
    const { note } = props
    const history = useHistory()
    const noteSaver = useDebouncePeakNoteSaver()
    const currentUser = useCurrentUser()
    const selected_tags: PeakTag[] = useLoadTags((note) ? note.tag_ids : [])
    const [title, setTitle] = useState((note) ? note.title : "")
    const [author, setAuthor] = useState((note) ? note.author : "")

    if (!note) {
        history.push(`/home/notes`)
        return null
    }

    return (
        <div className={"peak-note-view-container"}>
            <PeakNoteEditor note_id={note.id}/>
        </div>
    )
}
