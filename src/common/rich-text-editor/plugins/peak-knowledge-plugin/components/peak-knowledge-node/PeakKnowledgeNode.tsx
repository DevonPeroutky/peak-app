import React from "react";
import {ReactEditor, RenderElementProps, useEditor} from "slate-react";
import cn from 'classnames';
import {
    LinkOutlined,
    ShareAltOutlined
} from "@ant-design/icons/lib";
import {isNodeEmpty} from "../../../journal-entry-plugin/journal-entry/JournalEntry";
import {PeakTagSelect} from "./peak-tag-select/component/PeakTagSelect";
import {capitalize_and_truncate} from "../../../../../../utils/strings";
import "./peak-knowledge-node.scss"
import {PeakTag} from "../../../../../../types";
import {Link} from "react-router-dom";
import {message, Tooltip} from "antd";
import {ImageLoader} from "../../../../../image-loader/ImageLoader";
import {deriveHostname} from "../../../../../../utils/urls";
const bookmark = require('../../../../../../assets/icons/bookmark.svg');

export const PeakKnowledgeNode = (props: RenderElementProps) => {
    const { element } = props
    const editor = useEditor()
    const path = ReactEditor.findPath(editor, props.element)
    const tags = element.selected_tags as PeakTag[]
    const og_link = element.url as string
    const base_domain = deriveHostname(og_link)

    return (
        <div className={cn("peak-knowledge-node-container")} {...props.attributes} key={0} tabIndex={0}>
            <div className={"peak-knowledge-title-row web"} contentEditable={false}>
                <div className="title-section">
                    <Link to={`/home/notes/${element.note_id}`} className={"web-note-title"}>
                        <h2>{capitalize_and_truncate(element.title as string, 100)}</h2>
                    </Link>
                    {
                        (tags.length == 0 ) ?
                            null :
                            <PeakTagSelect
                                nodeId={element.id as number}
                                nodePath={path}
                                selected_tags={(tags) ? tags : []}
                                disabled={true}
                                hideIcon={true}/>
                    }
                </div>
            </div>
            <ContentBody {...props}/>
            <div className={"web-footer"} contentEditable={false}>
                <ImageLoader
                    className="title-row-icon web"
                    url={element.icon_url as string}
                    fallbackElement={
                        <img src={bookmark} className={"title-row-icon web"}/>
                    }
                />
                <a href={og_link} target="_blank" className="external-link">{base_domain}</a>
            </div>
        </div>
    )
}

const ContentBody = (props: RenderElementProps) => {
    const { element } = props
    const isEmpty: boolean = isNodeEmpty(element)
    if (isEmpty) {
        return (
            <div className={cn("space-block")} contentEditable={false}>
                <span className={"nothing"}>{props.children}</span>
            </div>
        )
    } else {
        return (
            <div className={cn("web-body")} contentEditable={false}>
                {props.children}
            </div>
        )
    }

}

const CopyToolTip = (props) => {
    const onClick = () => {
        message.info("No implemented yet")
    }
    return (
        <Tooltip
            placement="top"
            title="Copy ">
            <ShareAltOutlined className={"external-link-icon"} onClick={onClick}/>
        </Tooltip>
    )
}

const ExternalLinkToolTip = (props: { url: string }) => {
    const { url } = props

    const onClick = () => console.log(`Clicked! `)

    return (
        <Tooltip
            placement="top"
            title="Go to link">
            <a href={url} target="_blank">
                <LinkOutlined className={"external-link-icon"} onClick={onClick}/>
            </a>
        </Tooltip>
    )
}
