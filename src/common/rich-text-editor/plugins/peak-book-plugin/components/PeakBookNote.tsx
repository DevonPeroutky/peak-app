import * as React from 'react';
import {ReactEditor, RenderElementProps, useEditor} from "slate-react";
import cn from "classnames";
import {PeakTag} from "../../../../../redux/tagSlice";
import {isNodeEmpty} from "../../journal-entry-plugin/journal-entry/JournalEntry";
import "./peak-book-note.scss"
import {PeakTagSelect} from "../../../components/peak-knowledge-node/peak-tag-select/PeakTagSelect";

export const PeakBookNote = (props: RenderElementProps) => {
    const { element } = props
    const editor = useEditor()
    const path = ReactEditor.findPath(editor, props.element)
    const tags = element.selected_tags as PeakTag[]
    const isEmpty: boolean = isNodeEmpty(element)
    console.log(element)

    return (
        <div className={cn("peak-book-container", (isEmpty) ? "empty" : "")} {...props.attributes} key={0} tabIndex={0}>
            {props.children}
            <PeakTagSelect nodeId={element.id as number} nodePath={path} selected_tags={(tags) ? tags : []}/>
        </div>
    )
}
