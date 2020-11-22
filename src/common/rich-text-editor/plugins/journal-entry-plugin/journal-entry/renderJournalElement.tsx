import React from "react";
import {RenderElementProps} from "slate-react";
import {JOURNAL_ENTRY, JOURNAL_ENTRY_HEADER} from "../../../types";
import {JournalEntryBody, JournalEntryHeader} from "./JournalEntry";

// @ts-ignore
export const renderJournalElement = (options: any ) => (props: RenderElementProps) => {
    const { attributes, children, element } = props
    switch (element.type) {
        case JOURNAL_ENTRY:
            return <JournalEntryBody entry_date={props.element.entry_date as string} {...props}/>
        case JOURNAL_ENTRY_HEADER:
            return <JournalEntryHeader entry_date={props.element.entry_date as string} {...props}/>
        default:
            break;
    }
};
