import {withReact} from "slate-react";
import {withHistory} from "slate-history";
import {
    BlockquotePlugin,
    BoldPlugin,
    CodePlugin,
    DEFAULTS_ALIGN,
    DEFAULTS_BLOCKQUOTE, DEFAULTS_BOLD, DEFAULTS_CODE, DEFAULTS_CODE_BLOCK,
    DEFAULTS_HEADING,
    DEFAULTS_IMAGE, DEFAULTS_ITALIC,
    DEFAULTS_LIST,
    DEFAULTS_MEDIA_EMBED,
    DEFAULTS_MENTION,
    DEFAULTS_PARAGRAPH, DEFAULTS_STRIKETHROUGH, DEFAULTS_SUBSUPSCRIPT, DEFAULTS_UNDERLINE,
    ELEMENT_BLOCKQUOTE,
    getSelectableElement,
    ImagePlugin,
    isBlockAboveEmpty,
    isSelectionAtBlockStart,
    ItalicPlugin,
    ListPlugin, ParagraphPlugin,
    ResetBlockTypePlugin,
    setDefaults,
    SoftBreakPlugin,
    StrikethroughPlugin,
    UnderlinePlugin,
    withAutoformat,
    withImageUpload,
    withLink, withList, withNodeID,
} from "@udecode/slate-plugins";
import {autoformatRules, withAutoReplace} from "./plugins/withAutoReplace";
import {PeakHeadingPlugin} from "./plugins/peak-heading-plugin/TextHeadingPlugin";
import {PeakLinkPlugin} from "./plugins/peak-link-plugin/PeakLinkPlugin";
import {PeakCalloutPlugin} from "./plugins/peak-callout-plugin/PeakCalloutPlugin";
import {CALLOUT, HEADER_TYPES, JOURNAL_ENTRY, PEAK_STRIKETHROUGH_OVERRIDES} from "./constants";
import {PeakCompletedPlugin} from "./plugins/completed-plugin/CompletedPlugin";

export const defaultOptions = {
    ...setDefaults(DEFAULTS_PARAGRAPH, {}),
    ...setDefaults(DEFAULTS_MENTION, {}),
    ...setDefaults(DEFAULTS_BLOCKQUOTE, {}),
    ...setDefaults(DEFAULTS_IMAGE, {}),
    ...setDefaults(DEFAULTS_MEDIA_EMBED, {}),
    ...setDefaults(DEFAULTS_LIST, {}),
    ...setDefaults(DEFAULTS_ALIGN, {}),
    ...setDefaults(DEFAULTS_BOLD, {}),
    ...setDefaults(DEFAULTS_ITALIC, {}),
    ...setDefaults(DEFAULTS_UNDERLINE, {}),
    ...setDefaults(PEAK_STRIKETHROUGH_OVERRIDES, DEFAULTS_STRIKETHROUGH),
    ...setDefaults(DEFAULTS_SUBSUPSCRIPT, {}),
    ...setDefaults(DEFAULTS_CODE, {}),
};

const draggableComponentOptions = [
    { ...defaultOptions.p, level: 1 },
    defaultOptions.blockquote,
    defaultOptions.img,
    defaultOptions.ol,
    defaultOptions.ul,
    defaultOptions.media_embed,
].map(
    ({
         type,
         level,
         component,
         ...options
     }: {
        type: string;
        level?: number;
        component: any;
    }) => [
        type,
        {
            ...options,
            component: getSelectableElement({
                component,
                level,
                styles: {
                    blockAndGutter: {
                        padding: '4px 0',
                    },
                    blockToolbarWrapper: {
                        height: '1.5em',
                    },
                },
            }),
            rootProps: {
                styles: {
                    root: {
                        margin: 0,
                        lineHeight: '1.5',
                    },
                },
            },
        },
    ]
);
const options = {
    ...defaultOptions,
    ...Object.fromEntries(draggableComponentOptions),
};
export const newBasePlugins = [
    ParagraphPlugin(options),
    CodePlugin(options),
    ListPlugin(options),
    BlockquotePlugin(options),
    ImagePlugin(options),
    BoldPlugin(options),
    ItalicPlugin(options),
    UnderlinePlugin(options),
    SoftBreakPlugin({
        rules: [
            {
                hotkey: 'enter',
                query: {
                    allow: [ELEMENT_BLOCKQUOTE, JOURNAL_ENTRY, CALLOUT],
                },
            },
        ],
    }),
    StrikethroughPlugin(options),
    ResetBlockTypePlugin({
        rules: [
            {
                types: [ELEMENT_BLOCKQUOTE, CALLOUT],
                hotkey: ['Enter'],
                predicate: isBlockAboveEmpty
            },
            {
                types: [...HEADER_TYPES, ELEMENT_BLOCKQUOTE, CALLOUT],
                hotkey: ['Backspace'],
                predicate: isSelectionAtBlockStart
            }
        ]
    }),
    // TODO. Pass options into these.
    PeakCompletedPlugin(),
    PeakHeadingPlugin(),
    PeakLinkPlugin(),
    PeakCalloutPlugin()
];
export const baseNormalizers = [
    withReact,
    withHistory,
    withLink(),
    withImageUpload(),
    withAutoformat({
        rules: autoformatRules,
    }),
    withList(options),
    withNodeID(),
    withAutoReplace,
];
