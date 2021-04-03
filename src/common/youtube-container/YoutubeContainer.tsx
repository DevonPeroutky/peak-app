import React from "react";
import "./youtube-container.scss"

export const YoutubeNoteHeaderSection = (props: { url: string }) => {
    const { url } = props
    // og: https://www.youtube.com/watch?v=oVgn5s13H6Y
    // dest: https://www.youtube.com/embed/oVgn5s13H6Y
    const og_url = new URL(url)
    const videoId = og_url.searchParams.get("v")
    const embeddedUrl: string = `https://www.youtube.com/embed/${videoId}`

    return (
        <iframe src={embeddedUrl} className={"youtube-video"}/>
    )
}
