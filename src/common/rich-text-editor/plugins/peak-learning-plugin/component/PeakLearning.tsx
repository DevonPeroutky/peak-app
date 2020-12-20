import {ReactEditor, RenderElementProps, useEditor} from "slate-react";
import React from "react";
import {PeakTag} from "../../../../../redux/tagSlice";
import cn from 'classnames';
import {isNodeEmpty} from "../../journal-entry-plugin/journal-entry/JournalEntry";
import {PeakTagSelect} from "../../../components/peak-tag-select/PeakTagSelect";
import "./peak-learning.scss"

export const PeakLearning = (props: RenderElementProps) => {
    const { element } = props
    const editor = useEditor()
    const path = ReactEditor.findPath(editor, props.element)
    const tags = element.selected_tags as PeakTag[]
    console.log(element)
    const isEmpty: boolean = isNodeEmpty(element)

    return (
        <div className={cn("peak-learning-container", (isEmpty) ? "empty" : "")} {...props.attributes} key={0} tabIndex={0}>
            {props.children}
            <PeakTagSelect nodeId={element.id as number} nodePath={path} selected_tags={(tags) ? tags : []}/>
        </div>
    )
}

