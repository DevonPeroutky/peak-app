import {useHistory} from "react-router-dom";
import {createNewPeakBook, useCurrentNote, useDebouncePeakNoteSaver, useSpecificNote} from "../../../client/notes";
import React, {useEffect, useState} from "react";
import {useCurrentUser} from "../../../utils/hooks";
import {Divider, message} from "antd";
import {PeakNoteEditor} from "./note-editor/PeakNoteEditor";
import {BookHeaderSection} from "./NoteView";
import {useQuery} from "../../../utils/urls";
import {getCoverImageUrl} from "../../../client/openLibrary";
import {PeakNote, STUB_BOOK_ID} from "../../../redux/slices/noteSlice";

export const PeakDraftNoteView = (props) => {
    const history = useHistory()
    const query = useQuery();
    const currentUser = useCurrentUser();
    const noteSaver = useDebouncePeakNoteSaver()
    const [currentNote, setCurrentNote] = useState<PeakNote | null>(null)
    const titleParam: string | null = query.get("title")
    const coverIdParam: string | null = query.get("cover-id")
    const authorParam: string | null = query.get("author")
    const bookIconUrl: string = getCoverImageUrl(parseInt(coverIdParam), "L")

    console.log(`DRAFTing`)
    console.log(titleParam)
    console.log(coverIdParam)
    console.log(authorParam)

    if (!titleParam && !authorParam) {
        message.error("Something went wrong! Tell Devon")
        history.push(`/home/journal`)
    }

    useEffect(() => {
        if (!currentNote) {
            createNewPeakBook(currentUser.id, {title: titleParam, iconUrl: bookIconUrl, author: authorParam}).then(setCurrentNote)
        }
    }, [])

    const [title, setTitle] = useState(titleParam)
    const [author, setAuthor] = useState(authorParam)
    const note_id = (currentNote) ? currentNote.id : STUB_BOOK_ID

    const onTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value)
        noteSaver(currentUser.id, currentNote.id, { title: e.target.value })
    }
    const onAuthorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAuthor(e.target.value)
        noteSaver(currentUser.id, currentNote.id, { author: e.target.value })
    }

    return (
        <div className={"peak-note-view-container"}>
            <BookHeaderSection
                title={title}
                onTitleChange={onTitleChange}
                author={author}
                onAuthorChange={onAuthorChange}
                note_id={note_id}
                icon_url={(currentNote) ? currentNote.icon_url : bookIconUrl}
                selected_tags={[]}/>
            <Divider className={"note-divider"}/>
            <PeakNoteEditor note_id={note_id}/>
        </div>
    )
}
