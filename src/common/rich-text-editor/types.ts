import {
    ELEMENT_H1,
    ELEMENT_H2,
    ELEMENT_H3,
    ELEMENT_H4,
    ELEMENT_H5,
    ELEMENT_H6,
    SlatePluginKey,
    SlatePluginOptions,
    SPEditor,
} from "@udecode/slate-plugins";
import {Editor} from "slate";
import {PeakKnowledgeKeyOption} from "./plugins/peak-knowledge-plugin/types";
import {PeakCalloutKeyOption} from "./plugins/peak-callout-plugin/defaults";
import {ReactEditor} from "slate-react";
import {HistoryEditor} from "slate-history";

export const DIVIDER = "divider";
export const JOURNAL_ENTRY = "journal_entry";
export const JOURNAL_ENTRY_HEADER = "journal_entry_header";

export const TITLE = "title";
export const JOURNAL = "journal";
export const TIMELINE = "timeline";
export const HEADER_TYPES: string [] = [ELEMENT_H1, ELEMENT_H2, ELEMENT_H3, ELEMENT_H4, ELEMENT_H5, ELEMENT_H6]

export declare type PeakSlatePluginKey = SlatePluginKey | PeakKnowledgeKeyOption | PeakCalloutKeyOption

export type UghEditorType = ReactEditor & HistoryEditor & SPEditor

export type PeakPluginOption = Partial<Record<SlatePluginKey, Partial<SlatePluginOptions>>>
