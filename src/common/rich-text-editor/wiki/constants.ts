import {PeakTitlePlugin} from "../plugins/peak-title-plugin/PeakTitlePlugin";
import {
    BlockquotePlugin,
    BoldPlugin,
    CodePlugin,
    ELEMENT_BLOCKQUOTE,
    ELEMENT_CODE_BLOCK,
    ELEMENT_PARAGRAPH,
    ExitBreakPlugin,
    ImagePlugin, isBlockAboveEmpty, isSelectionAtBlockStart,
    ItalicPlugin,
    ListPlugin,
    ParagraphPlugin, ResetBlockTypePlugin,
    SoftBreakPlugin,
    StrikethroughPlugin,
    UnderlinePlugin,
    withInlineVoid, withList,
    withNormalizeTypes,
    withTrailingNode
} from "@udecode/slate-plugins";
import {CALLOUT, HEADER_TYPES, JOURNAL_ENTRY, JOURNAL_ENTRY_HEADER, TITLE} from "../constants";
import {
    baseNormalizers,
    defaultOptions,
    baseDraggableComponentOptions,
    styleDraggableOptions
} from "../defaults";
import {PeakCompletedPlugin} from "../plugins/completed-plugin/CompletedPlugin";
import {PeakHeadingPlugin} from "../plugins/peak-heading-plugin/TextHeadingPlugin";
import {PeakLinkPlugin} from "../plugins/peak-link-plugin/PeakLinkPlugin";
import {PeakCalloutPlugin} from "../plugins/peak-callout-plugin/PeakCalloutPlugin";

const wikiDraggableOptions = [...baseDraggableComponentOptions, { ...defaultOptions.p, level: 1 }].map(styleDraggableOptions);
const options = {
    ...defaultOptions,
    ...Object.fromEntries(wikiDraggableOptions),
};

export const wikiPlugins = [
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
    PeakCalloutPlugin(),
    PeakTitlePlugin(),
    ExitBreakPlugin({
        rules: [
            {
                hotkey: 'mod+enter',
                query: {
                    allow: [ELEMENT_BLOCKQUOTE, CALLOUT],
                },
            },
            {
                hotkey: 'mod+shift+enter',
                before: true,
            },
            {
                hotkey: 'enter',
                query: {
                    allow: [...HEADER_TYPES, TITLE],
                },
            },
        ],
    })
];
export const wikiNormalizers = [
    ...baseNormalizers,
    withList(options),
    withNormalizeTypes({
        rules: [{ path: [0, 0], strictType: TITLE }],
    }),
    withInlineVoid({ plugins: wikiPlugins, voidTypes: [ELEMENT_CODE_BLOCK, JOURNAL_ENTRY_HEADER] }),
    withTrailingNode({ type: ELEMENT_PARAGRAPH, level: 1 }),
] as const;
