import React from "react";
import {ReactEditor, RenderElementProps, useEditor} from "slate-react";
import cn from 'classnames';
import {BookTwoTone, BulbOutlined, LinkOutlined, ReadOutlined, ShareAltOutlined} from "@ant-design/icons/lib";
import {isNodeEmpty} from "../../../journal-entry-plugin/journal-entry/JournalEntry";
import {PeakTagSelect} from "./peak-tag-select/component/PeakTagSelect";
import {capitalize_and_truncate} from "../../../../../../utils/strings";
import {ELEMENT_WEB_NOTE, PEAK_LEARNING} from "../../constants";
import "./peak-knowledge-node.scss"
import {PeakTag} from "../../../../../../types";
import {Link} from "react-router-dom";
import {message, Tooltip} from "antd";
const bookmark = require('../../../../../../assets/icons/bookmark.svg');

export const PeakKnowledgeNode = (props: RenderElementProps) => {
    const { element } = props
    const editor = useEditor()
    const path = ReactEditor.findPath(editor, props.element)
    const tags = element.selected_tags as PeakTag[]
    const isEmpty: boolean = isNodeEmpty(element)
    console.log(element)

    return (
        <div className={cn("peak-knowledge-node-container", (isEmpty) ? "empty" : "")} {...props.attributes} key={0} tabIndex={0}>
            <div className={"peak-knowledge-title-row web"} contentEditable={false}>
                <div className="title-section">
                    <BookTwoTone className={"main-icon"}/>
                    <span>Saved the page </span>
                        <img src={bookmark} className={"title-row-icon web"}/>
                        <span className={"knowledge-label"}>
                            <Link to={`/home/notes/${element.note_id}`} className={"link-to-note"}>{capitalize_and_truncate(element.title as string, 100)}</Link>
                        </span>
                </div>
                <div className="icon-section">
                    <ExternalLinkToolTip url={element.url as string}/>
                    <CopyToolTip/>
                </div>
            </div>
            <div className={cn("web-body", (isEmpty) ? "empty" : "")}>
                {props.children}
            </div>
            <div className={"web-footer"}>
                <PeakTagSelect nodeId={element.id as number} nodePath={path} selected_tags={(tags) ? tags : []}/>
            </div>
        </div>
    )
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
