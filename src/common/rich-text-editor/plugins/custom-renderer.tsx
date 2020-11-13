import {RenderElementProps} from "slate-react";
import PeakCodeEditor from "./peak-code-plugin/code-editor/PeakCodeEditor";
import React from "react";
import {PeakCallout} from "./peak-callout-plugin/PeakCallout";
import {ELEMENT_CODE_BLOCK} from "@udecode/slate-plugins";
import {JournalEntryBody, JournalEntryHeader} from "./journal-entry-plugin/journal-entry/JournalEntry";
import {CALLOUT, JOURNAL_ENTRY, JOURNAL_ENTRY_HEADER} from "../constants";
import "./completed-plugin/completed.scss"

// @ts-ignore
export const renderCustomPeakElement = (options: any ) => (props: RenderElementProps) => {
    const { attributes, children, element } = props
    switch (element.type) {
        case CALLOUT:
            return <PeakCallout {...props}/>
        case ELEMENT_CODE_BLOCK:
            return <PeakCodeEditor key={props.element.code_id as string} {...props}/>
        case JOURNAL_ENTRY:
            return <JournalEntryBody entry_date={props.element.entry_date as string} {...props}/>
        case JOURNAL_ENTRY_HEADER:
            return <JournalEntryHeader entry_date={props.element.entry_date as string} {...props}/>
        default:
            break;
    }
};
