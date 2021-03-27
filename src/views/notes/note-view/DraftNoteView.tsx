import {useHistory} from "react-router-dom";
import {
    useBooks,
    usePeakNoteCreator,
} from "../../../client/notes";
import React, {useEffect} from "react";
import {useCurrentUser } from "../../../utils/hooks";
import { Divider, message, Skeleton} from "antd";
import {useQuery} from "../../../utils/urls";
import {getCoverImageUrl} from "../../../client/openLibrary";
import {PeakNote} from "../../../redux/slices/noteSlice";
import "./draft-note-view.scss"
import {buildNoteUrl} from "../../../utils/notes";

export const PeakDraftNoteView = (props) => {
    const history = useHistory()
    const query = useQuery();
    const currentUser = useCurrentUser();
    const books = useBooks();
    const noteCreator = usePeakNoteCreator()
    const titleParam: string | null = query.get("title")
    const coverIdParam: string | null = query.get("cover-id")
    const authorParam: string | null = query.get("author")
    const bookIconUrl: string = getCoverImageUrl(parseInt(coverIdParam), "L")

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
            noteCreator(currentUser, {title: titleParam, iconUrl: bookIconUrl, author: author}).then((note) => {
                history.push(buildNoteUrl(note.id))
            })
        }
    }, [])

    return (
        <div className={"peak-note-draft-view-container"}>
            <Skeleton paragraph={{ rows: 0}}/>
            <Skeleton active avatar={{ shape: 'square', size: 96}} className={"peak-draft-height"} paragraph={{ rows: 4 }}/>
            <Divider className={"note-divider"}/>
            <Skeleton active/>
        </div>
    )
}
