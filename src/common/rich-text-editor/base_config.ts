import {withReact} from "slate-react";
import {withHistory} from "slate-history";
import {
    BlockquotePlugin,
    BoldPlugin,
    CodePlugin,
    ELEMENT_BLOCKQUOTE,
    ELEMENT_PARAGRAPH,
    ExitBreakPlugin, getBlockAbove,
    getSelectableElement,
    ImagePlugin,
    isAncestorEmpty, isBlockAboveEmpty,
    isSelectionAtBlockEnd,
    isSelectionAtBlockStart,
    ItalicPlugin,
    ListPlugin,
    ParagraphPlugin,
    ResetBlockTypePlugin,
    SlatePlugin,
    SoftBreakPlugin,
    StrikethroughPlugin,
    UnderlinePlugin,
    withAutoformat,
    withImageUpload,
    withLink,
    withList,
    withNodeID,
    withTrailingNode,
} from "@udecode/slate-plugins";
import {autoformatRules, withAutoReplace} from "./plugins/withAutoReplace";
import {PeakHeadingPlugin} from "./plugins/peak-heading-plugin/PeakHeadingPlugin";
import {PeakLinkPlugin} from "./plugins/peak-link-plugin/PeakLinkPlugin";
import {PeakCalloutPlugin} from "./plugins/peak-callout-plugin/PeakCalloutPlugin";
import {StyledNodeConfig, HEADER_TYPES, JOURNAL_ENTRY, SlateNormalizer, TITLE} from "./types";
import {DEFAULTS_CALLOUT, PEAK_CALLOUT} from "./plugins/peak-callout-plugin/defaults";
import {PeakCodePlugin} from "./plugins/peak-code-plugin/PeakCodePlugin";
import {PeakKnowledgePlugin} from "./plugins/peak-knowledge-plugin/PeakKnowledgePlugin";
import {ELEMENT_PEAK_BOOK, PEAK_LEARNING} from "./plugins/peak-knowledge-plugin/constants";
import {defaultOptions} from "./defaults";

const styleDraggableOptions = ({ type, level, component, ...options}: StyledNodeConfig) => (
    [
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
                ...options.rootProps,
                styles: {
                    root: {
                        margin: 0,
                        lineHeight: '1.5',
                    },
                },
            },
        },
    ]
)

export const baseBehaviorPlugins = [
    SoftBreakPlugin({
        rules: [
            {
                hotkey: 'enter',
                query: {
                    allow: [ELEMENT_BLOCKQUOTE, JOURNAL_ENTRY, PEAK_CALLOUT, PEAK_LEARNING, ELEMENT_PEAK_BOOK],
                },
            },
        ],
    }),
    ResetBlockTypePlugin({
        rules: [
            {
                types: [ELEMENT_BLOCKQUOTE, PEAK_CALLOUT],
                hotkey: ['Enter'],
                defaultType: ELEMENT_PARAGRAPH,
                predicate: isBlockAboveEmpty,
            },
            {
                types: [...HEADER_TYPES, ELEMENT_BLOCKQUOTE, PEAK_CALLOUT],
                hotkey: ['Backspace'],
                defaultType: ELEMENT_PARAGRAPH,
                predicate: isSelectionAtBlockStart,
            }
        ]
    }),
]
const basePlugins = [
    ParagraphPlugin,
    CodePlugin,
    ListPlugin,
    BlockquotePlugin,
    ImagePlugin,
    BoldPlugin,
    ItalicPlugin,
    UnderlinePlugin,
    StrikethroughPlugin,
    PeakHeadingPlugin,
    PeakCodePlugin,
    PeakLinkPlugin,
    PeakCalloutPlugin,
    PeakKnowledgePlugin
];

export const baseOptions = [
    defaultOptions.img,
    defaultOptions.ol,
    defaultOptions.ul,
    defaultOptions.media_embed,
    defaultOptions.callout,
    defaultOptions.h1,
    defaultOptions.h2,
    defaultOptions.h3,
    defaultOptions.h4,
    defaultOptions.h5,
    defaultOptions.h6,
    defaultOptions.blockquote,
    defaultOptions.code_block,
    defaultOptions.learning,
    defaultOptions.peak_book_note,
    defaultOptions.peak_web_note,
    defaultOptions.p
]
const baseNormalizers = [
    withReact,
    withHistory,
    withLink(),
    withImageUpload(),
    withAutoformat({
        rules: autoformatRules,
    }),
    withNodeID(),
    withAutoReplace,
];

export const snowflakePlugins = (level: number) => {
    return [
        ExitBreakPlugin({
            rules: [
                {
                    hotkey: 'mod+enter',
                    query: {
                        allow: [ELEMENT_BLOCKQUOTE, PEAK_CALLOUT, PEAK_LEARNING, ELEMENT_PEAK_BOOK],
                        filter: (entry => {
                            const [node, path] = Array.from(entry)
                            return path.length === level + 2
                        })
                    },
                    level: level + 1,
                },
                {
                    hotkey: 'mod+enter',
                    query: {
                        allow: [ELEMENT_BLOCKQUOTE, PEAK_CALLOUT, PEAK_LEARNING, ELEMENT_PEAK_BOOK],
                        filter: (entry => {
                            const [node, path] = Array.from(entry)
                            return path.length === level + 1
                        })
                    },
                    level: level,
                },
                {
                    hotkey: 'mod+shift+enter',
                    before: true,
                    level: level,
                },
                {
                    hotkey: 'enter',
                    level: level,
                    query: {
                        allow: [...HEADER_TYPES, TITLE],
                    },
                },
            ],
        }),
    ]
}
const levelDependentNormalizers = (level: number) => [
    withTrailingNode({ type: ELEMENT_PARAGRAPH, level: level })
]

export const setEditorPlugins = (baseNodeLevel: number = 1, additionalPlugins: SlatePlugin[] = [], draggable: boolean = true) => {
    const levelAwareDragConfig = baseOptions.map(sup => {
        return {...sup, level: baseNodeLevel}
    })

    const draggableOptions = levelAwareDragConfig.map(styleDraggableOptions);
    const copyableOptions = [] // IMPLEMENT ME

    const options = (draggable) ? { ...defaultOptions, ...Object.fromEntries(draggableOptions) } : defaultOptions

    const slatePlugins: SlatePlugin[] = basePlugins.map(plugin => plugin(options))
    return [...slatePlugins, ...baseBehaviorPlugins, ...additionalPlugins, ...snowflakePlugins(baseNodeLevel)]
}
export const setEditorNormalizers = (baseNodeLevel: number = 1, additionalNormalizers?: SlateNormalizer[], draggable: boolean = true) => {
    const levelAwareDragConfig = baseOptions.map(sup => {
        return {...sup, level: baseNodeLevel}
    })
    const draggableOptions = levelAwareDragConfig.map(styleDraggableOptions);
    const copyableOptions = [] // IMPLEMENT ME

    const options = (draggable) ? { ...defaultOptions, ...Object.fromEntries(draggableOptions) } : defaultOptions

    return [...baseNormalizers, withList(options), ...additionalNormalizers, ...levelDependentNormalizers(baseNodeLevel)]
}
