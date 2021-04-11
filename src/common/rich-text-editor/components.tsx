import {
    createSlatePluginsComponents,
    ELEMENT_BLOCKQUOTE, ELEMENT_CODE_BLOCK,
    ELEMENT_H1,
    ELEMENT_H2,
    ELEMENT_H3,
    ELEMENT_H4,
    ELEMENT_H5,
    ELEMENT_H6,
    ELEMENT_IMAGE, ELEMENT_LI, ELEMENT_MEDIA_EMBED,
    ELEMENT_OL,
    ELEMENT_PARAGRAPH,
    ELEMENT_TABLE,
    ELEMENT_TODO_LI,
    ELEMENT_UL,
    withDraggables,
    withPlaceholders,
} from "@udecode/slate-plugins";
import {DragIndicator} from "@styled-icons/material/DragIndicator";
import React from "react";
import {cloneDeep} from "lodash";
import {
    PEAK_LI_STYLE,
    PEAK_OL_STYLE,
    PEAK_UL_STYLE,
    PeakBlockquoteElement, PeakCodeBlockElement
} from "./plugins/slateComponentWrappers";
import {TITLE} from "./types";
import {PeakTitleElement} from "./plugins/peak-title-plugin/peak-title/PeakTitle";
import {PEAK_CALLOUT} from "./plugins/peak-callout-plugin/defaults";
import {PeakCalloutElement} from "./plugins/peak-callout-plugin/component/PeakCallout";

const withStyledPlaceHolders = (components: any) =>
    withPlaceholders(components, [
        {
            key: TITLE,
            placeholder: 'Page Title',
            hideOnBlur: false,
        },
        {
            key: ELEMENT_PARAGRAPH,
            placeholder: 'Type \'/\' for commands',
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
        {
            key: ELEMENT_H3,
            placeholder: 'Heading 3',
            hideOnBlur: false,
        },
        {
            key: ELEMENT_H4,
            placeholder: 'Heading 4',
            hideOnBlur: false,
        },
        {
            key: ELEMENT_H5,
            placeholder: 'Heading 5',
            hideOnBlur: false,
        },
        {
            key: ELEMENT_H6,
            placeholder: 'Heading 6',
            hideOnBlur: false,
        },
        {
            key: ELEMENT_CODE_BLOCK,
            placeholder: 'Type some code',
            hideOnBlur: false,
        },
    ]);

const withStyledDraggables = (components: any) => {
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
                PEAK_CALLOUT
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
            key: PEAK_CALLOUT,
            styles: {
                gutterLeft: {
                    padding: '12px 0 0',
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

export let defaultComponents = createSlatePluginsComponents({
    [ELEMENT_BLOCKQUOTE]: PeakBlockquoteElement,
    [ELEMENT_LI]: PEAK_LI_STYLE,
    [ELEMENT_UL]: PEAK_UL_STYLE,
    [ELEMENT_OL]: PEAK_OL_STYLE,
    [ELEMENT_CODE_BLOCK]: PeakCodeBlockElement,
    [TITLE]: PeakTitleElement,
    [PEAK_CALLOUT]: PeakCalloutElement
})
defaultComponents = withStyledPlaceHolders(defaultComponents)
defaultComponents = withStyledDraggables(defaultComponents)

export const basicComponent = cloneDeep(defaultComponents)

