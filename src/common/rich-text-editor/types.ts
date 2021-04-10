import {
    ELEMENT_H1,
    ELEMENT_H2,
    ELEMENT_H3,
    ELEMENT_H4,
    ELEMENT_H5,
    ELEMENT_H6,
    SlatePluginKey,
} from "@udecode/slate-plugins";
import {Editor} from "slate";
import {PEAK_NOTE_STUB} from "./plugins/peak-note-stub-plugin/types";
import {PeakKnowledgeKeyOption} from "./plugins/peak-knowledge-plugin/types";
import {PeakCalloutKeyOption} from "./plugins/peak-callout-plugin/defaults";

export const DIVIDER = "divider";
export const JOURNAL_ENTRY = "journal_entry";
export const JOURNAL_ENTRY_HEADER = "journal_entry_header";

export const TITLE = "title";
export const JOURNAL = "journal";
export const TIMELINE = "timeline";
export const HEADER_TYPES: string [] = [ELEMENT_H1, ELEMENT_H2, ELEMENT_H3, ELEMENT_H4, ELEMENT_H5, ELEMENT_H6]

export type SlateNormalizer = (rules: any) => <T extends Editor>(editor: T) => T
export interface StyledNodeConfig {
    type: string
    level?: number
    component: any
    rootProps: any
}

// export const PEAK_VOID_TYPES = [ELEMENT_CODE_BLOCK, JOURNAL_ENTRY_HEADER, PEAK_NOTE_STUB]
export const PEAK_VOID_TYPES = [JOURNAL_ENTRY_HEADER, PEAK_NOTE_STUB]


export declare type PeakSlatePluginKey = SlatePluginKey | PeakKnowledgeKeyOption | PeakCalloutKeyOption
