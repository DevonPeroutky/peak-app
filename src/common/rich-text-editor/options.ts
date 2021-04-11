import {
    MARK_STRIKETHROUGH,
} from '@udecode/slate-plugins-basic-marks';
import { ELEMENT_BLOCKQUOTE } from '@udecode/slate-plugins-block-quote';
import { ELEMENT_CODE_BLOCK } from '@udecode/slate-plugins-code-block';
import { SlatePluginOptions } from '@udecode/slate-plugins-core';
import { ELEMENT_PARAGRAPH } from '@udecode/slate-plugins-paragraph';
import {PEAK_CALLOUT} from "./plugins/peak-callout-plugin/defaults";
import {ELEMENT_PEAK_BOOK, PEAK_LEARNING} from "./plugins/peak-knowledge-plugin/constants";
import {JOURNAL_ENTRY, PeakPluginOption, TITLE} from "./types";
import {
    createSlatePluginsOptions, ELEMENT_TD, ELEMENT_TODO_LI, ExitBreakPluginOptions,
    isBlockAboveEmpty,
    isSelectionAtBlockStart, KEYS_HEADING, ResetBlockTypePluginOptions,
    SoftBreakPluginOptions,
} from "@udecode/slate-plugins";
import {options} from "../../views/scratchpad/playground/defaultOptions";

const PEAK_STRIKETHROUGH_OPTIONS: Partial<SlatePluginOptions> = {
    hotkey: 'mod+shift+x',
}

export const defaultOptions = createSlatePluginsOptions({
    [MARK_STRIKETHROUGH]: PEAK_STRIKETHROUGH_OPTIONS,
})

const resetBlockTypesCommonRule = {
    types: [
        defaultOptions[ELEMENT_BLOCKQUOTE].type,
        defaultOptions[ELEMENT_TODO_LI].type,
        PEAK_CALLOUT,
        defaultOptions[ELEMENT_CODE_BLOCK].type
    ],
    defaultType: defaultOptions[ELEMENT_PARAGRAPH].type,
};
export const PEAK_RESET_BLOCK_OPTIONS: ResetBlockTypePluginOptions = {
    rules: [
        {
            ...resetBlockTypesCommonRule,
            hotkey: 'Enter',
            predicate: isBlockAboveEmpty,
        },
        {
            ...resetBlockTypesCommonRule,
            hotkey: 'Backspace',
            predicate: isSelectionAtBlockStart,
        },
    ],
};
export const PEAK_EXIT_BREAK_OPTIONS: ExitBreakPluginOptions = {
    rules: [
        {
            hotkey: 'mod+enter',
            query: {
                allow: [defaultOptions[ELEMENT_BLOCKQUOTE].type, PEAK_CALLOUT, PEAK_LEARNING, ELEMENT_PEAK_BOOK, ELEMENT_CODE_BLOCK],
            },
        },
        {
            hotkey: 'mod+shift+enter',
            before: true,
        },
        {
            hotkey: 'enter',
            query: {
                start: true,
                end: true,
                allow: [...KEYS_HEADING, TITLE],
            },
        },
    ],
}
export const PEAK_SOFT_BREAK_OPTIONS: SoftBreakPluginOptions = {
    rules: [
        { hotkey: 'shift+enter' },
        {
            hotkey: 'enter',
            query: {
                allow: [
                    ELEMENT_BLOCKQUOTE,
                    JOURNAL_ENTRY,
                    PEAK_CALLOUT,
                    PEAK_LEARNING,
                    ELEMENT_PEAK_BOOK,
                    options[ELEMENT_CODE_BLOCK].type,
                    options[ELEMENT_TD].type
                ],
            },
        },
    ],
}
