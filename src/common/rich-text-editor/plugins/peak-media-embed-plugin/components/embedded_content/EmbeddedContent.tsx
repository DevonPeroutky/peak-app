import React from "react";
import {YoutubeVideoContainer} from "../../../../../media-embeds/youtube-container/YoutubeContainer";
import {TweetContainer} from "../../../../../media-embeds/twitter-container/TwitterContainer";
import {StyledElementProps} from "@udecode/slate-plugins";
import {deriveBaseDomain, deriveHostname} from "../../../../../../utils/urls";
import "./embedded-content.scss"

export const RichLinkEmbed = ({attributes, children, nodeProps, ...props}: StyledElementProps) => {
    console.log(`Rich Link Preview! `, props)
    const { title, url, cover_image_url, fav_icon_url, description } = props.element
    return (
        <div className={"voidable-slate-element editor-rich-link-preview"} {...attributes} contentEditable={false}>
            <div className={"left-column"}>
                {(title) ? <div className={"title"}>{title}</div> : null}
                {(description) ? <div className={"description"}>{description}</div> : null}
                <div className={"footer"}>
                    {/*{(fav_icon_url) ? <img className={"favIcon"} src={fav_icon_url}/> : null}*/}
                    <div className={"hostname"}>{deriveHostname(url)}</div>
                </div>
            </div>
            {/*<div className={"right-column"}>*/}
            {/*    <div className={"cover-image"}></div>*/}
            {/*</div>*/}
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