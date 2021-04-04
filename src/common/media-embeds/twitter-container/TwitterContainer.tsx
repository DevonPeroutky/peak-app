import React from "react";
import cn from "classnames";
import TweetEmbed from "react-tweet-embed/dist/tweet-embed";

export const TweetContainer = (props: { url: string, className?: string }) => {
    const { url, className } = props
    // og: https://twitter.com/bgurley/status/1377674626210222082
    // id: 1377674626210222082
    const og_url = new URL(url)
    const pathNames: string[] = (og_url.pathname) ? og_url.pathname.split("/") : []
    if (pathNames.length < 4) {
        return null
    }

    return (
        <TweetEmbed id={pathNames[3]} className={cn("tweet-container", className)}/>
    )
}
