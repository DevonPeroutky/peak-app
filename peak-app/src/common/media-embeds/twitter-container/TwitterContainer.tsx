import React from "react";
import cn from "classnames";
import TweetEmbed from "react-tweet-embed/dist/tweet-embed";
import {parseTwitterId} from "../../../utils/urls";

export const TweetContainer = (props: { url: string, className?: string }) => {
    const { url, className } = props
    const tweetId = parseTwitterId(url)
    if (!tweetId) {
        return null
    }

    return (
        <TweetEmbed id={tweetId} className={cn("tweet-container", className)}/>
    )
}
