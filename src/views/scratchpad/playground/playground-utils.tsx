import React from 'react';
import {
    createSlatePluginsOptions,
    ELEMENT_BLOCKQUOTE,
    ELEMENT_CODE_BLOCK,
    ELEMENT_H1,
    ELEMENT_H2,
    ELEMENT_H3,
    ELEMENT_OL,
    ELEMENT_PARAGRAPH,
    ELEMENT_TODO_LI,
    ELEMENT_UL,
    MARK_HIGHLIGHT,
    MentionNodeData,
    withDraggables,
    withPlaceholders,
    ELEMENT_H4,
    ELEMENT_H5,
    ELEMENT_H6,
    ELEMENT_IMAGE,
    ELEMENT_LINK,
    ELEMENT_MEDIA_EMBED,
    ELEMENT_TABLE,
    ExitBreakPluginOptions,
    KEYS_HEADING,
    ELEMENT_TD,
    isSelectionAtBlockStart,
    SoftBreakPluginOptions,
    isBlockAboveEmpty,
    ResetBlockTypePluginOptions,
} from "@udecode/slate-plugins";
import { DragIndicator } from '@styled-icons/material/DragIndicator';
import {options} from "./defaultOptions";

export const optionsMentionPlugin = {
    mentionables: [],
    maxSuggestions: 10,
    insertSpaceAfterMention: false,
    trigger: '@',
    mentionableFilter: (s: string) => (mentionable: MentionNodeData) =>
        mentionable.email.toLowerCase().includes(s.toLowerCase()) ||
        mentionable.name.toLowerCase().includes(s.toLowerCase()),
    mentionableSearchPattern: '\\S*',
};

export const initialValueHighlight: any = [
    {
        type: options[ELEMENT_H2].type,
        children: [
            {
                text: '🌈 Highlight',
            },
        ],
    },
    {
        type: options[ELEMENT_PARAGRAPH].type,
        children: [
            {
                text: 'The Highlight plugin enables support for ',
            },
            {
                text: 'highlights',
                [options[MARK_HIGHLIGHT].type]: true,
            },
            {
                text:
                    ', useful when reviewing content or highlighting it for future reference.',
            },
        ],
    },
];

const resetBlockTypesCommonRule = {
    types: [options[ELEMENT_BLOCKQUOTE].type, options[ELEMENT_TODO_LI].type],
    defaultType: options[ELEMENT_PARAGRAPH].type,
};

export const optionsResetBlockTypePlugin: ResetBlockTypePluginOptions = {
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

export const optionsSoftBreakPlugin: SoftBreakPluginOptions = {
    rules: [
        { hotkey: 'shift+enter' },
        {
            hotkey: 'enter',
            query: {
                allow: [
                    options[ELEMENT_CODE_BLOCK].type,
                    options[ELEMENT_BLOCKQUOTE].type,
                    options[ELEMENT_TD].type,
                ],
            },
        },
    ],
};

export const optionsExitBreakPlugin: ExitBreakPluginOptions = {
    rules: [
        {
            hotkey: 'mod+enter',
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
                allow: KEYS_HEADING,
            },
        },
    ],
};