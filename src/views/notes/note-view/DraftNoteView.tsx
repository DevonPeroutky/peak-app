import {useHistory} from "react-router-dom";
import {
    useBooks,
    useDebouncePeakNoteSaver, usePeakNoteCreator,
} from "../../../client/notes";
import React, {useEffect, useState} from "react";
import {useCurrentUser, useJournal} from "../../../utils/hooks";
import {Divider, message} from "antd";
import {PeakNoteEditor} from "./note-editor/PeakNoteEditor";
import {useQuery} from "../../../utils/urls";
import {getCoverImageUrl} from "../../../client/openLibrary";
import {PeakNote, STUB_BOOK_ID} from "../../../redux/slices/noteSlice";
import {BookHeaderSection} from "./NoteView";
import {JournalEntry} from "../../../common/rich-text-editor/editors/journal/types";
import {sleep} from "../../../chrome-extension/utils/generalUtil";

export const PeakDraftNoteView = (props) => {
    const history = useHistory()
    const query = useQuery();
    const currentUser = useCurrentUser();
    const journal = useJournal();
    const books = useBooks();
    const noteSaver = useDebouncePeakNoteSaver()
    const noteCreator = usePeakNoteCreator()
    const [currentNote, setCurrentNote] = useState<PeakNote | null>(null)
    const titleParam: string | null = query.get("title")
    const coverIdParam: string | null = query.get("cover-id")
    const authorParam: string | null = query.get("author")
    const bookIconUrl: string = getCoverImageUrl(parseInt(coverIdParam), "L")

    if (!titleParam && !authorParam) {
        message.error("Something went wrong! Tell Devon")
        history.push(`/home/journal`)
    }

    const [title, setTitle] = useState(titleParam)
    const [author, setAuthor] = useState((authorParam === "undefined") ? "" : authorParam)
    const [created, setCreated] = useState(false)
    const [canCreate, setCanCreate] = useState(false)
    const note_id = (currentNote) ? currentNote.id : STUB_BOOK_ID

    useEffect(() => {
        // We have a race condition between the default Journal updater with is debounced at 1000 and we want to be after
        sleep(1500).then(() => {
            setCanCreate(true)
        })
    }, [])

    useEffect(() => {
        if (!currentNote && !created && canCreate) {
            const existingBook: PeakNote | undefined = (books.find(b => b.title.toLowerCase() === titleParam.toLowerCase() && b.author.toLowerCase() === authorParam.toLowerCase()))

            if (existingBook) {
                setCurrentNote(existingBook)
                setCreated(true)
            } else {
                noteCreator(currentUser, {title: title, iconUrl: bookIconUrl, author: author}, journal.body as JournalEntry[]).then(setCurrentNote)
                setCreated(true)
            }
        }
    }, [journal.body, canCreate])

    const onTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value)
        console.log(`SUBMITTING NEW TITLE`, currentNote)
        noteSaver(currentUser, currentNote, { title: e.target.value }, journal.body as JournalEntry[])
    }
    const onAuthorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAuthor(e.target.value)
        console.log(`SUBMITTING NEW AUTHOR`, currentNote)
        noteSaver(currentUser, currentNote, { author: e.target.value }, journal.body as JournalEntry[])
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
