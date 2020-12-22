import {ReactEditor, RenderElementProps, useEditor} from "slate-react";
import React from "react";
import cn from 'classnames';
import {BulbOutlined, ReadOutlined} from "@ant-design/icons/lib";
import {PeakTag} from "../../../../redux/tagSlice";
import {isNodeEmpty} from "../../plugins/journal-entry-plugin/journal-entry/JournalEntry";
import {PeakTagSelect} from "./peak-tag-select/PeakTagSelect";
import {PEAK_LEARNING} from "../../plugins/peak-learning-plugin/defaults";
import {capitalize_and_truncate} from "../../../../utils/strings";
import "./peak-knowledge-node.scss"

export const PeakKnowledgeNode = (props: RenderElementProps) => {
    const { element } = props
    const editor = useEditor()
    const path = ReactEditor.findPath(editor, props.element)
    const tags = element.selected_tags as PeakTag[]
    const isEmpty: boolean = isNodeEmpty(element)

    return (
        <div className={cn("peak-knowledge-node-container", (isEmpty) ? "empty" : "")} {...props.attributes} key={0} tabIndex={0}>
            <KnowledgeTitleRow elementType={element.type as string} label={element.title as string | undefined}/>
            {props.children}
            <PeakTagSelect nodeId={element.id as number} nodePath={path} selected_tags={(tags) ? tags : []}/>
        </div>
    )
}

const KnowledgeTitleRow = (props: {elementType: string, label: string | undefined}) => {
    const { elementType, label } = props
    if (elementType === PEAK_LEARNING) {
        return (
            <div className={"peak-knowledge-title-row learning"} contentEditable={false}>
                <BulbOutlined className={"learning-title-row-icon"}/>
                <span>Learning</span>
           </div>
        )
    } else {
        return (
            <div className={"peak-knowledge-title-row book"} contentEditable={false}>
                <ReadOutlined className={"learning-title-row-icon"}/>
                <span>{capitalize_and_truncate(label)}</span>
            </div>
        )
    }
}
