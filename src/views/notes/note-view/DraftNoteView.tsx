import {useHistory} from "react-router-dom";
import {
    useBooks, usePeakBookCreator,
    usePeakNoteCreator,
} from "../../../client/notes";
import React, {useEffect} from "react";
import {useCurrentUser } from "../../../utils/hooks";
import { Divider, message, Skeleton} from "antd";
import {useQuery} from "../../../utils/urls";
import {getCoverImageUrl} from "../../../client/openLibrary";
import {PeakNote} from "../../../redux/slices/noteSlice";
import {buildNoteUrl} from "../../../utils/notes";
import {NoteSkeleton} from "./note-skeleton/NoteSkeleton";

export const PeakDraftNoteView = (props) => {
    const history = useHistory()
    const query = useQuery();
    const currentUser = useCurrentUser();
    const books = useBooks();
    const bookCreator = usePeakBookCreator()
    const titleParam: string | null = query.get("title")
    const coverIdParam: string | null = query.get("cover-id")
    const authorParam: string | null = query.get("author")

    if (!titleParam && !authorParam) {
        message.error("Something went wrong! Tell Devon")
        history.push(`/home`)
    }

    const author = (authorParam === "undefined") ? "" : authorParam

    useEffect(() => {
        const existingBook: PeakNote | undefined = (books.find(b => b.title.toLowerCase() === titleParam.toLowerCase() && b.author.toLowerCase() === authorParam.toLowerCase()))

        if (existingBook) {
            // setCurrentNote(existingBook)
            history.push(buildNoteUrl(existingBook.id))
        } else {
            const bookIconUrl: string | undefined = (coverIdParam != undefined && coverIdParam != "undefined") ? getCoverImageUrl(parseInt(coverIdParam), "L") : undefined
            bookCreator(currentUser, titleParam, author, bookIconUrl).then((note) => {
                history.push(buildNoteUrl(note.id))
            })
        }
    }, [])

    return <NoteSkeleton/>
}

export const DraftLearningNoteView = (props) => {
    const history = useHistory()
    const currentUser = useCurrentUser();
    const noteCreator = usePeakNoteCreator()

    useEffect(() => {
        noteCreator(currentUser).then((note) => {
            history.push(buildNoteUrl(note.id))
        })
    }, [])

    return <NoteSkeleton/>
}
