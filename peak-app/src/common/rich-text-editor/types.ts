import {
    SlatePluginKey,
    SlatePluginOptions,
    SPEditor,
} from "@udecode/slate-plugins";
import {PeakKnowledgeKeyOption} from "./plugins/peak-knowledge-plugin/types";
import {ReactEditor} from "slate-react";
import {HistoryEditor} from "slate-history";
import { PeakCalloutKeyOption } from "component-library";

export const JOURNAL_ENTRY = "journal_entry";
export const JOURNAL_ENTRY_HEADER = "journal_entry_header";

export const TITLE = "title";
export const JOURNAL = "journal";
export const TIMELINE = "timeline";

export declare type PeakSlatePluginKey = SlatePluginKey | PeakKnowledgeKeyOption | PeakCalloutKeyOption
export type UghEditorType = ReactEditor & HistoryEditor & SPEditor
