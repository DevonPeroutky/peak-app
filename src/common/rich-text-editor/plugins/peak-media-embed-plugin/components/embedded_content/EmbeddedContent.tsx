import React from "react";
import {YoutubeVideoContainer} from "../../../../../media-embeds/youtube-container/YoutubeContainer";
import {TweetContainer} from "../../../../../media-embeds/twitter-container/TwitterContainer";
import {StyledElementProps} from "@udecode/slate-plugins";
import {
    ELEMENT_MEDIA_EMBED,
    ELEMENT_TWITTER_EMBED,
    ELEMENT_YOUTUBE_EMBED,
    PEAK_MEDIA_EMBED
} from "../../types";


export const EmbeddedContent = ({attributes, children, nodeProps, ...props}: StyledElementProps) => {
    const embedUrl: string = props.element.embedded_url
    const embedType: PEAK_MEDIA_EMBED = props.element.embed_type

    if (embedType === ELEMENT_MEDIA_EMBED) {
        return <div>TBD</div>
    }

    if (embedType === ELEMENT_YOUTUBE_EMBED) {
        // return <YoutubeVideoContainer url={note.url} className={"youtube-container media-container"}/>
    }

    if (embedType === ELEMENT_TWITTER_EMBED) {
        // return <TweetContainer url={note.url} className={"tweet-container media-container"}/>
    }

    return <p>Something went wrong trying to embed that content. Just delete this</p>
}