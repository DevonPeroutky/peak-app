import React from "react";
import {
    BlockquoteElementBase,
    ClassName,
    createSlatePluginsComponents,
    createSlatePluginsOptions,
    ELEMENT_BLOCKQUOTE, ELEMENT_CODE_BLOCK,
    ELEMENT_H1,
    ELEMENT_H2,
    ELEMENT_H3,
    ELEMENT_H4,
    ELEMENT_H5,
    ELEMENT_H6,
    ELEMENT_IMAGE,
    ELEMENT_MEDIA_EMBED,
    ELEMENT_MENTION,
    ELEMENT_OL,
    ELEMENT_PARAGRAPH,
    ELEMENT_TABLE,
    ELEMENT_TODO_LI,
    ELEMENT_UL,
    getBlockquoteElementStyles,
    MARK_STRIKETHROUGH,
    MentionElement,
    MentionNodeData,
    RootStyleSet,
    SlatePluginOptions,
    StyledElement,
    StyledElementProps,
    withDraggables,
    withPlaceholders,
    withProps
} from "@udecode/slate-plugins";
import {DragIndicator} from "@styled-icons/material/DragIndicator";
import { styled } from '@uifabric/utilities';

const PEAK_STRIKETHROUGH_OPTIONS: Partial<SlatePluginOptions> = {
    hotkey: 'mod+shift+x',
}

export const PEAK_TODO_LIST_OPTIONS: Partial<SlatePluginOptions> = {
    hotkey: ['mod+opt+5', 'mod+shift+5'],
};

export const options = createSlatePluginsOptions({
    [MARK_STRIKETHROUGH]: PEAK_STRIKETHROUGH_OPTIONS,
    [ELEMENT_TODO_LI]: PEAK_TODO_LIST_OPTIONS
})

const renderMentionLabel = (mentionable: MentionNodeData) => {
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
            placeholder: 'Heading 1',
            hideOnBlur: false,
        },
        {
            key: ELEMENT_H2,
            placeholder: 'Heading 2',
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

export const BlockquoteElement = styled<
    StyledElementProps,
    ClassName,
    RootStyleSet
    >(BlockquoteElementBase, getBlockquoteElementStyles({ className: "peak-blockquote" }), undefined, {
    scope: 'BlockquoteElement',
});
let components = createSlatePluginsComponents({
    [ELEMENT_MENTION]: withProps(MentionElement, {
        renderLabel: renderMentionLabel,
    }),
    [ELEMENT_BLOCKQUOTE]: BlockquoteElement
})

