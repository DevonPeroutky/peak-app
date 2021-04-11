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

const options = createSlatePluginsOptions();
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
export const renderMentionLabel = (mentionable: MentionNodeData) => {
    const entry = [].find((m) => m.value === mentionable.value);
    if (!entry) return 'unknown option';
    return `${entry.name} - ${entry.email}`;
};

export const withStyledPlaceHolders = (components: any) =>
    withPlaceholders(components, [
        {
            key: ELEMENT_PARAGRAPH,
            placeholder: 'Type a paragraph',
            hideOnBlur: true,
        },
        {
            key: ELEMENT_H1,
            placeholder: 'Untitled',
            hideOnBlur: false,
        },
    ]);

export const withStyledDraggables = (components: any) => {
    return withDraggables(components, [
        {
            keys: [ELEMENT_PARAGRAPH, ELEMENT_UL, ELEMENT_OL],
            level: 0,
        },
        {
            keys: [
                ELEMENT_PARAGRAPH,
                ELEMENT_BLOCKQUOTE,
                ELEMENT_TODO_LI,
                ELEMENT_H1,
                ELEMENT_H2,
                ELEMENT_H3,
                ELEMENT_H4,
                ELEMENT_H5,
                ELEMENT_H6,
                ELEMENT_IMAGE,
                ELEMENT_OL,
                ELEMENT_UL,
                ELEMENT_TABLE,
                ELEMENT_MEDIA_EMBED,
                ELEMENT_CODE_BLOCK,
            ],
            dragIcon: (
                <DragIndicator
                    style={{
                        width: 18,
                        height: 18,
                        color: 'rgba(55, 53, 47, 0.3)',
                    }}
                />
            ),
        },
        {
            key: ELEMENT_H1,
            styles: {
                gutterLeft: {
                    padding: '2em 0 4px',
                    fontSize: '1.875em',
                },
                blockToolbarWrapper: {
                    height: '1.3em',
                },
            },
        },
        {
            key: ELEMENT_H2,
            styles: {
                gutterLeft: {
                    padding: '1.4em 0 1px',
                    fontSize: '1.5em',
                },
                blockToolbarWrapper: {
                    height: '1.3em',
                },
            },
        },
        {
            key: ELEMENT_H3,
            styles: {
                gutterLeft: {
                    padding: '1em 0 1px',
                    fontSize: '1.25em',
                },
                blockToolbarWrapper: {
                    height: '1.3em',
                },
            },
        },
        {
            keys: [ELEMENT_H4, ELEMENT_H5, ELEMENT_H6],
            styles: {
                gutterLeft: {
                    padding: '0.75em 0 0',
                    fontSize: '1.1em',
                },
                blockToolbarWrapper: {
                    height: '1.3em',
                },
            },
        },
        {
            keys: [ELEMENT_PARAGRAPH, ELEMENT_UL, ELEMENT_OL],
            styles: {
                gutterLeft: {
                    padding: '4px 0 0',
                },
            },
        },
        {
            key: ELEMENT_BLOCKQUOTE,
            styles: {
                gutterLeft: {
                    padding: '18px 0 0',
                },
            },
        },
        {
            key: ELEMENT_CODE_BLOCK,
            styles: {
                gutterLeft: {
                    padding: '12px 0 0',
                },
            },
        },
    ]);
};


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