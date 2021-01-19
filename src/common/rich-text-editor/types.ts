import {
    ELEMENT_H1,
    ELEMENT_H2,
    ELEMENT_H3,
    ELEMENT_H4,
    ELEMENT_H5,
    ELEMENT_H6,
} from "@udecode/slate-plugins";
import {Editor} from "slate";

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
