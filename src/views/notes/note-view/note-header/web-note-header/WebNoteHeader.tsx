import {PeakNote} from "../../../../../redux/slices/noteSlice";
import {PeakTag} from "../../../../../types";
import {Link} from "react-router-dom";
import {CaretLeftFilled, CaretRightFilled} from "@ant-design/icons/lib";
import {capitalize_and_truncate} from "../../../../../utils/strings";
import {deriveHostname} from "../../../../../utils/urls";
import { YoutubeVideoContainer } from "../../../../../common/media-embeds/youtube-container/YoutubeContainer";
import {NoteTagSelect} from "../../../../../common/rich-text-editor/plugins/peak-knowledge-plugin/components/peak-knowledge-node/peak-tag-select/component/NoteTagSelect";
import React from "react";
import TextArea from "antd/es/input/TextArea";
import "./web-note-header.scss"
import {TweetContainer} from "../../../../../common/media-embeds/twitter-container/TwitterContainer";

export const WebNoteHeaderSection = (props: {note: PeakNote, title: string, onTitleChange: (e) => void, selected_tags: PeakTag[]}) => {
    const { note, selected_tags, onTitleChange, title } = props

    return (
        <div className={"note-header-section web_note"}>
            <div className={"note-subheader-section"}>
                <Link to={`/home/notes`} className={"note-link-container"}><CaretLeftFilled/> Back to notes</Link>
                <a href={note.url} target={"_blank"} className={"note-link-container"}>
                    <img className={"note-web-icon"} src={note.icon_url}/>
                    <span className={"note-url"}>{`${capitalize_and_truncate(deriveHostname(note.url))}`} <CaretRightFilled/></span>
                </a>
            </div>
            <div className={"note-header-row"}>
                <TextArea
                    className={"web-title-input"}
                    bordered={false}
                    onChange={onTitleChange}
                    autoSize={{minRows: 1, maxRows: 8}}
                    value={title}/>
                {renderEmbeddeds(note)}
                <NoteTagSelect selected_tags={selected_tags} note_id={note.id}/>
            </div>
        </div>
    )
}

const renderEmbeddeds = (note: PeakNote) => {
    if (!note.url) {
        return null
    }
    const og_url = new URL(note.url)

    if (og_url.hostname === "www.youtube.com") {
        return <YoutubeVideoContainer url={note.url} className={"youtube-container media-container"}/>
    }


    let re = /^\/[a-zA-Z0-9]+\/status\/\d+/
    const res = re.exec(og_url.pathname)
    if (og_url.hostname === "twitter.com" && res ) {
        return <TweetContainer url={note.url} className={"tweet-container media-container"}/>
    }

    return null
}