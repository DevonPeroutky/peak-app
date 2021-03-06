import {withReact} from "slate-react";
import {withHistory} from "slate-history";
import {
    BlockquotePlugin,
    BoldPlugin,
    CodePlugin,
    ELEMENT_BLOCKQUOTE,
    ELEMENT_PARAGRAPH,
    ExitBreakPlugin,
    getSelectableElement,
    ImagePlugin,
    isBlockAboveEmpty,
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
    withDeserializeHTML,
    withDeserializeMd,
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
import {PEAK_CALLOUT} from "./plugins/peak-callout-plugin/defaults";
import {PeakCodePlugin} from "./plugins/peak-code-plugin/PeakCodePlugin";
import {PeakKnowledgePlugin} from "./plugins/peak-knowledge-plugin/PeakKnowledgePlugin";
import {ELEMENT_PEAK_BOOK, PEAK_LEARNING} from "./plugins/peak-knowledge-plugin/constants";
import {defaultOptions} from "./defaults";
import React from "react";
import {DragOutlined} from "@ant-design/icons/lib";

const styleDraggableOptions = ({ type, level, component, ...options}: StyledNodeConfig) => (
    [
        type,
        {
            ...options,
            component: getSelectableElement({
                component,
                level,
                dragIcon: <DragOutlined/>,
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

export const defaultStyleOptions = ({ type, rootProps, ...options}: StyledNodeConfig) => (
    [
        type,
        {
            ...options,
            rootProps: {
                ...rootProps,
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
                types: [ELEMENT_BLOCKQUOTE, PEAK_CALLOUT],
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
    defaultOptions.peak_note_stub,
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
                        start: true,
                        end: true,
                        allow: [...HEADER_TYPES, TITLE],
                    },
                },
            ],
        }),
    ]
}

const deriveLevelAwareOptions = (editorLevel: number, draggable: boolean) => {
    const levelAwareConfig = baseOptions.map(sup => {
        return {...sup, level: editorLevel}
    })
    // TODO CHANGE BACK TO ABOVE
    const styledOptions = (draggable) ? levelAwareConfig.map(styleDraggableOptions) : levelAwareConfig.map(defaultStyleOptions);
    // const styledOptions = (draggable) ? levelAwareConfig.map(defaultStyleOptions) : levelAwareConfig.map(defaultStyleOptions);
    return { ...defaultOptions, ...Object.fromEntries(styledOptions) }
}

export const setEditorPlugins = (baseNodeLevel: number = 1, additionalPlugins: SlatePlugin[] = [], draggable: boolean = true) => {
    const options = deriveLevelAwareOptions(baseNodeLevel, draggable)
    const slatePlugins: SlatePlugin[] = basePlugins.map(plugin => plugin(options))
    return [...slatePlugins, ...baseBehaviorPlugins, ...additionalPlugins, ...snowflakePlugins(baseNodeLevel)]
}


const levelDependentNormalizers = (level: number) => [
    withTrailingNode({ type: ELEMENT_PARAGRAPH, level: level })
]
export const setEditorNormalizers = (baseNodeLevel: number = 1, additionalNormalizers?: SlateNormalizer[], draggable: boolean = true) => {
    const options = deriveLevelAwareOptions(baseNodeLevel, draggable)
    const plugins: SlatePlugin[] = basePlugins.map(plugin => plugin(options))
    return [...baseNormalizers, withList(options), withDeserializeHTML({ plugins }), withDeserializeMd(options), ...additionalNormalizers, ...levelDependentNormalizers(baseNodeLevel)]
}