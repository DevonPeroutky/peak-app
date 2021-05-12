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
    ELEMENT_LI,
    ELEMENT_LINK,
    ELEMENT_MEDIA_EMBED,
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
import {PEAK_LEARNING} from "./plugins/peak-knowledge-plugin/constants";
import {PeakLearningElement} from "./plugins/peak-knowledge-plugin/components/peak-learning-node/PeakLearningNode";
import {PeakInlineLinkElement} from "./plugins/peak-link-plugin/inline-link/PeakHyperLink";
import {
    ELEMENT_EMBED_STUB,
    ELEMENT_TWITTER_EMBED,
    ELEMENT_YOUTUBE_EMBED
} from "./plugins/peak-media-embed-plugin/types";
import {PeakMediaStubElement} from "./plugins/peak-media-embed-plugin/components/stub/MediaEmbedStub";
import {
    RichLinkEmbed,
    TwitterEmbed,
    YoutubeEmbed
} from "./plugins/peak-media-embed-plugin/components/embedded_content/EmbeddedContent";
import {ELEMENT_DIVIDER} from "./plugins/peak-divider";
import {DividerElement} from "./plugins/peak-divider/element/DividerElement";
import {clone} from "ramda";
import {DRAGGABLE_ELEMENTS} from "./constants";

const defaultComponents = createSlatePluginsComponents({
    [ELEMENT_BLOCKQUOTE]: PeakBlockquoteElement,
    [ELEMENT_LI]: PEAK_LI_STYLE,
    [ELEMENT_UL]: PEAK_UL_STYLE,
    [ELEMENT_OL]: PEAK_OL_STYLE,
    [ELEMENT_CODE_BLOCK]: PeakCodeBlockElement,
    [TITLE]: PeakTitleElement,
    [PEAK_CALLOUT]: PeakCalloutElement,
    [PEAK_LEARNING]: PeakLearningElement,
    [ELEMENT_LINK]: PeakInlineLinkElement,
    [ELEMENT_EMBED_STUB]: PeakMediaStubElement,
    [ELEMENT_TWITTER_EMBED]: TwitterEmbed,
    [ELEMENT_YOUTUBE_EMBED]: YoutubeEmbed,
    [ELEMENT_MEDIA_EMBED]: RichLinkEmbed,
    [ELEMENT_DIVIDER]: DividerElement,
})

const withStyledPlaceHolders = (components: any, placeholders: Options<PlaceholderProps>[]) => {
    return withPlaceholders(components, placeholders);
}

const withStyledDraggables = (components: any) => {
    return withDraggables(components, [
        {
            level: 0,
            keys: DRAGGABLE_ELEMENTS,
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

export const useReadOnlyComponents = () => {
    return useMemo(() => {
        return clone(defaultComponents)
    }, [])
}