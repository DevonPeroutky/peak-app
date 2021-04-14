import React from "react";
import {YoutubeVideoContainer} from "../../../../../media-embeds/youtube-container/YoutubeContainer";
import {TweetContainer} from "../../../../../media-embeds/twitter-container/TwitterContainer";
import {StyledElementProps} from "@udecode/slate-plugins";
import {deriveHostname} from "../../../../../../utils/urls";
import "./embedded-content.scss"
import {ImageLoader} from "../../../../../image-loader/ImageLoader";

export const RichLinkEmbed = ({attributes, children, nodeProps, ...props}: StyledElementProps) => {
    console.log(`Rich Link Preview! `, props)
    const { title, url, cover_image_url, fav_icon_url, description } = props.element
    return (
        <div contentEditable={false} className={"voidable-slate-element"}>
            <a target={"_blank"} href={url} className={"rich-link-preview-container"}>
                <div className={"editor-rich-link-preview"} {...attributes} >
                    <div className={"left-column"}>
                        {(title) ? <div className={"title"}>{title}</div> : null}
                        {(description) ? <div className={"description"}>{description}</div> : null}
                        <div className={"footer"}>
                            <ImageLoader url={fav_icon_url} fallbackElement={null} className={"fav-icon"}/>
                            <div className={"hostname"}>{deriveHostname(url)}</div>
                        </div>
                    </div>
                    <div className={"right-column"}>
                        <ImageLoader url={cover_image_url} fallbackElement={null} className={"cover-image"}/>
                    </div>
                </div>
            </a>
            {children}
        </div>
    )
}

export const TwitterEmbed = ({attributes, children, nodeProps, ...props}: StyledElementProps) => {
    const embedUrl: string = props.element.url
    return (
        <div className={"voidable-slate-element embedded-tweet"} contentEditable={false}>
            <TweetContainer url={embedUrl} className={"tweet-container media-container"}/>
            {children}
        </div>
    )
}
export const YoutubeEmbed = ({attributes, children, nodeProps, ...props}: StyledElementProps) => {
    const embedUrl: string = props.element.url
    return (
        <div className={"voidable-slate-element embedded-video"} contentEditable={false}>
            <YoutubeVideoContainer url={embedUrl} className={"youtube-container"}/>
            {children}
        </div>
    )
}