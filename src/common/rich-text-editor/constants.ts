import {
    ELEMENT_H1,
    ELEMENT_H2,
    ELEMENT_H3,
    ELEMENT_H4,
    ELEMENT_H5, ELEMENT_H6,
    MARK_STRIKETHROUGH,
    StyledLeaf
} from "@udecode/slate-plugins";

export const CALLOUT = "callout";
export const DIVIDER = "divider";
export const JOURNAL_ENTRY = "journal_entry";
export const JOURNAL_ENTRY_HEADER = "journal_entry_header";

export const TITLE = "title";
export const JOURNAL = "journal";
export const TIMELINE = "timeline";

export const PEAK_STRIKETHROUGH_OPTIONS = {
    strikethrough: {
        component: StyledLeaf,
        type: MARK_STRIKETHROUGH,
        hotkey: 'mod+shift+x',
        rootProps: {
            className: `slate-strikethrough`,
            as: 's',
        },
    }
}

export const HEADER_TYPES: string [] = [ELEMENT_H1, ELEMENT_H2, ELEMENT_H3, ELEMENT_H4, ELEMENT_H5, ELEMENT_H6]
