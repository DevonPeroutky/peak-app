import {withReact} from "slate-react";
import {withHistory} from "slate-history";
import {
    BlockquotePlugin,
    BoldPlugin,
    CodePlugin,
    DEFAULTS_MENTION,
    ELEMENT_BLOCKQUOTE,
    ImagePlugin,
    isBlockAboveEmpty,
    isSelectionAtBlockStart,
    ItalicPlugin,
    ListPlugin,
    MentionNodeData,
    MentionPlugin,
    ResetBlockTypePlugin,
    SoftBreakPlugin,
    StrikethroughPlugin,
    UnderlinePlugin,
    withAutoformat,
    withImageUpload,
    withLink,
    withToggleType,
    withTransforms
} from "@udecode/slate-plugins";
import {autoformatRules, withAutoReplace} from "./plugins/withAutoReplace";
import {PeakHeadingPlugin} from "./plugins/peak-heading-plugin/TextHeadingPlugin";
import {PeakLinkPlugin} from "./plugins/peak-link-plugin/PeakLinkPlugin";
import {PeakCalloutPlugin} from "./plugins/peak-callout-plugin/PeakCalloutPlugin";
import {CALLOUT, HEADER_TYPES, JOURNAL_ENTRY, PEAK_STRIKETHROUGH_OPTIONS} from "./constants";
import {PeakCompletedPlugin} from "./plugins/completed-plugin/CompletedPlugin";

export const basePlugins = [
    CodePlugin(),
    ListPlugin(),
    BlockquotePlugin(),
    ImagePlugin(),
    BoldPlugin(),
    ItalicPlugin(),
    UnderlinePlugin(),
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
    StrikethroughPlugin(PEAK_STRIKETHROUGH_OPTIONS),
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
    MentionPlugin({
        mention: {
            ...DEFAULTS_MENTION,
            // @ts-ignore
            onClick: (mentionable: MentionNodeData) => console.info(`Hello, I'm ${mentionable.value}`),
        },
    }),
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
    withToggleType(),
    withTransforms(),
    withAutoformat({
        rules: autoformatRules,
    }),
    withAutoReplace,
];
