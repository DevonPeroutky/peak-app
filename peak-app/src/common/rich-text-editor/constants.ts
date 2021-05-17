import {
    ELEMENT_BLOCKQUOTE, ELEMENT_CODE_BLOCK,
    ELEMENT_H1,
    ELEMENT_H2,
    ELEMENT_H3, ELEMENT_H4, ELEMENT_H5, ELEMENT_H6, ELEMENT_IMAGE, ELEMENT_MEDIA_EMBED, ELEMENT_OL,
    ELEMENT_PARAGRAPH, ELEMENT_TABLE,
    ELEMENT_TODO_LI, ELEMENT_UL, Options, PlaceholderProps
} from "@udecode/slate-plugins";
import {PEAK_LEARNING} from "./plugins/peak-knowledge-plugin/constants";
import {
    ELEMENT_EMBED_STUB,
    ELEMENT_TWITTER_EMBED,
    ELEMENT_YOUTUBE_EMBED
} from "./plugins/peak-media-embed-plugin/types";
import {TITLE} from "./types";
import {ELEMENT_DIVIDER, PEAK_CALLOUT} from "component-library/dist";

export const DRAGGABLE_ELEMENTS = [
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
    PEAK_CALLOUT,
    PEAK_LEARNING,
    ELEMENT_EMBED_STUB,
    ELEMENT_YOUTUBE_EMBED,
    ELEMENT_TWITTER_EMBED,
    ELEMENT_MEDIA_EMBED,
    ELEMENT_DIVIDER
]
export const NO_PLACEHOLDERS: Options<PlaceholderProps>[] = []
export const DEFAULT_PLACEHOLDERS: Options<PlaceholderProps>[] = [
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
    {
        key: ELEMENT_BLOCKQUOTE,
        placeholder: 'What inspired you?',
        hideOnBlur: false,
    },
]
