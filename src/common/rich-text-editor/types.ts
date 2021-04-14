import {
    SlatePluginKey,
    SlatePluginOptions,
    SPEditor,
} from "@udecode/slate-plugins";
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

export declare type PeakSlatePluginKey = SlatePluginKey | PeakKnowledgeKeyOption | PeakCalloutKeyOption
export type UghEditorType = ReactEditor & HistoryEditor & SPEditor
export type PeakPluginOption = Partial<Record<SlatePluginKey, Partial<SlatePluginOptions>>>