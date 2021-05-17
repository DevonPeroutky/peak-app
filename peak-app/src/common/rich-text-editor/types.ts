import { SPEditor } from "@udecode/slate-plugins";
import {ReactEditor} from "slate-react";
import {HistoryEditor} from "slate-history";

export const JOURNAL_ENTRY = "journal_entry";

export const JOURNAL = "journal";
export const TIMELINE = "timeline";

export type UghEditorType = ReactEditor & HistoryEditor & SPEditor
