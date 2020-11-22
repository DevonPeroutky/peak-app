import {withReact} from "slate-react";
import {withHistory} from "slate-history";
import {
    BlockquotePlugin,
    BoldPlugin,
    CodePlugin,
    DEFAULTS_ALIGN,
    DEFAULTS_BLOCKQUOTE, DEFAULTS_BOLD, DEFAULTS_CODE, DEFAULTS_CODE_BLOCK, DEFAULTS_HEADING,
    DEFAULTS_IMAGE, DEFAULTS_ITALIC,
    DEFAULTS_LIST,
    DEFAULTS_MEDIA_EMBED,
    DEFAULTS_MENTION,
    DEFAULTS_PARAGRAPH, DEFAULTS_STRIKETHROUGH, DEFAULTS_SUBSUPSCRIPT, DEFAULTS_UNDERLINE,
    ELEMENT_BLOCKQUOTE, ELEMENT_PARAGRAPH, ExitBreakPlugin,
    getSelectableElement, HeadingPlugin,
    ImagePlugin,
    isBlockAboveEmpty,
    isSelectionAtBlockStart,
    ItalicPlugin,
    ListPlugin,
    ParagraphPlugin,
    ResetBlockTypePlugin,
    setDefaults,
    SlatePlugin,
    SoftBreakPlugin,
    StrikethroughPlugin,
    UnderlinePlugin,
    withAutoformat,
    withImageUpload,
    withLink, withList, withNodeID, withTrailingNode,
} from "@udecode/slate-plugins";
import {autoformatRules, withAutoReplace} from "./plugins/withAutoReplace";
import {PeakHeadingPlugin} from "./plugins/peak-heading-plugin/PeakHeadingPlugin";
import {PeakLinkPlugin} from "./plugins/peak-link-plugin/PeakLinkPlugin";
import {PeakCalloutPlugin} from "./plugins/peak-callout-plugin/PeakCalloutPlugin";
import {DraggableNodeConfig, HEADER_TYPES, JOURNAL_ENTRY, SlateNormalizer, TITLE} from "./types";
import {PEAK_STRIKETHROUGH_OVERRIDES} from "./constants";
import {DEFAULTS_CALLOUT, PEAK_CALLOUT} from "./plugins/peak-callout-plugin/defaults";
import {DEFAULTS_PEAK_HEADING} from "./plugins/peak-heading-plugin/defaults";
import {PeakCodePlugin} from "./plugins/peak-code-plugin/PeakCodePlugin";
import {DEFAULTS_PEAK_CODE_BLOCK} from "./plugins/peak-code-plugin/defaults";
import {DEFAULTS_LEARNING, PEAK_LEARNING} from "./plugins/peak-learning-plugin/defaults";
import {PeakLearningPlugin} from "./plugins/peak-learning-plugin/PeakLearningPlugin";

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
    ...setDefaults(DEFAULTS_PEAK_HEADING, {}),
    ...setDefaults(DEFAULTS_CODE, {}),
    ...setDefaults(DEFAULTS_PEAK_CODE_BLOCK, {}),
    ...setDefaults(DEFAULTS_CALLOUT, {}),
    ...setDefaults(DEFAULTS_LEARNING, {}),
};

const styleDraggableOptions = ({ type, level, component, ...options}: DraggableNodeConfig) => (
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

const baseBehaviorPlugins = [
    SoftBreakPlugin({
        rules: [
            {
                hotkey: 'enter',
                query: {
                    allow: [ELEMENT_BLOCKQUOTE, JOURNAL_ENTRY, PEAK_CALLOUT, PEAK_LEARNING],
                },
            },
        ],
    }),
    ResetBlockTypePlugin({
        rules: [
            {
                types: [ELEMENT_BLOCKQUOTE, PEAK_CALLOUT, PEAK_LEARNING],
                hotkey: ['Enter'],
                predicate: isBlockAboveEmpty
            },
            {
                types: [...HEADER_TYPES, ELEMENT_BLOCKQUOTE, PEAK_CALLOUT, PEAK_LEARNING],
                hotkey: ['Backspace'],
                predicate: isSelectionAtBlockStart
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
    PeakLearningPlugin
];

const baseDraggableComponentOptions = [
    defaultOptions.blockquote,
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
    defaultOptions.code_block,
    defaultOptions.learning
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

const levelDependentPlugins = (level: number) => {
    return [
        ExitBreakPlugin({
            rules: [
                {
                    hotkey: 'mod+enter',
                    query: {
                        allow: [ELEMENT_BLOCKQUOTE, PEAK_CALLOUT, PEAK_LEARNING],
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
        })
    ]
}
const levelDependentNormalizers = (level: number) => [
    withTrailingNode({ type: ELEMENT_PARAGRAPH, level: level })
]

export const setEditorPlugins = (baseNodeLevel: number = 1, additionalPlugins: SlatePlugin[] = []) => {
    const paragraphDragConfig = { ...defaultOptions.p, level: 1 }
    const draggableOptions = [...baseDraggableComponentOptions, paragraphDragConfig].map(styleDraggableOptions);
    const copyableOptions = [] // IMPLEMENT ME

    const options = {
        ...defaultOptions,
        ...Object.fromEntries(draggableOptions),
    };

    const slatePlugins: SlatePlugin[] = basePlugins.map(plugin => plugin(options))
    return [...slatePlugins, ...baseBehaviorPlugins, ...additionalPlugins, ...levelDependentPlugins(baseNodeLevel)]
}
export const setEditorNormalizers = (baseNodeLevel: number = 1, additionalNormalizers?: SlateNormalizer[]) => {
    const paragraphDragConfig = { ...defaultOptions.p, level: baseNodeLevel }
    const draggableOptions = [...baseDraggableComponentOptions, paragraphDragConfig].map(styleDraggableOptions);
    const copyableOptions = [] // IMPLEMENT ME

    const options = {
        ...defaultOptions,
        ...Object.fromEntries(draggableOptions),
    };

    return [...baseNormalizers, withList(options), ...additionalNormalizers, ...levelDependentNormalizers(baseNodeLevel)]
}
