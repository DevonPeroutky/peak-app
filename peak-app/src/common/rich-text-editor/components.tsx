import {
    createSlatePluginsComponents,
    ELEMENT_BLOCKQUOTE,
    ELEMENT_CODE_BLOCK,
    ELEMENT_H1,
    ELEMENT_H2,
    ELEMENT_H3,
    ELEMENT_H4,
    ELEMENT_H5,
    ELEMENT_H6,
    ELEMENT_LINK,
    ELEMENT_OL,
    ELEMENT_PARAGRAPH,
    ELEMENT_UL,
    Options,
    PlaceholderProps,
    withDraggables,
    withPlaceholders,
} from "@udecode/slate-plugins";
import {DragIndicator} from "@styled-icons/material/DragIndicator";
import React, {useMemo} from "react";
import {PeakInlineLinkElement} from "./plugins/peak-link-plugin/inline-link/PeakHyperLink";
import { ELEMENT_EMBED_STUB } from "component-library";
import {PeakMediaStubElement} from "./plugins/peak-media-embed-plugin/components/stub/MediaEmbedStub";
import {clone} from "ramda";
import {DRAGGABLE_ELEMENTS} from "./constants";
import {PEAK_CALLOUT, PEAK_SLATE_COMPONENT_OVERRIDES} from "component-library/dist";

const defaultComponents = createSlatePluginsComponents({
    ...PEAK_SLATE_COMPONENT_OVERRIDES,
    [ELEMENT_LINK]: PeakInlineLinkElement,
    [ELEMENT_EMBED_STUB]: PeakMediaStubElement
})

const withStyledPlaceHolders = (components: any, placeholders: Options<PlaceholderProps>[]) => {
    return withPlaceholders(components, placeholders);
}

const withStyledDraggables = (components: any) => {
    return withDraggables(components, [
        {
            level: 0,
            keys: DRAGGABLE_ELEMENTS,
            onRenderDragHandle: ({ ...otherProps }) => (
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

export const useComponents = (dnd: boolean, placeholders: Options<PlaceholderProps>[]) => {
    return useMemo(() => {
        let components = clone(defaultComponents)

        if (dnd) {
            components = withStyledDraggables(components)
        }

        if (placeholders) {
            components = withStyledPlaceHolders(components, placeholders)
        }
        return components
    }, [dnd, placeholders])
}

