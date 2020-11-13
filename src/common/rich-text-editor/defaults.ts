import {ReactEditor, withReact} from "slate-react";
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
    ELEMENT_BLOCKQUOTE, ExitBreakPlugin,
    getSelectableElement,
    ImagePlugin,
    isBlockAboveEmpty,
    isSelectionAtBlockStart,
    ItalicPlugin,
    ListPlugin, ParagraphPlugin, RenderNodeOptions,
    ResetBlockTypePlugin,
    setDefaults,
    SlatePlugin,
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
import {CALLOUT, HEADER_TYPES, JOURNAL_ENTRY, PEAK_STRIKETHROUGH_OVERRIDES, TITLE} from "./constants";
import {PeakCompletedPlugin} from "./plugins/completed-plugin/CompletedPlugin";
import {Editor} from "slate";

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

export interface DraggableNodeConfig {
    type: string
    level?: number
    component: any
}
type SlateNormalizer = (rules: any) => <T extends Editor>(editor: T) => T

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
                    allow: [ELEMENT_BLOCKQUOTE, JOURNAL_ENTRY, CALLOUT],
                },
            },
        ],
    }),
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
    // TODO. Pass options into these.
    PeakCompletedPlugin,
    PeakHeadingPlugin,
    PeakLinkPlugin,
    PeakCalloutPlugin
];

const baseDraggableComponentOptions = [
    defaultOptions.blockquote,
    defaultOptions.img,
    defaultOptions.ol,
    defaultOptions.ul,
    defaultOptions.media_embed
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


// foo: { (data: string): void; } []
export const setEditorPlugins = (draggableConfig: DraggableNodeConfig[], additionalPlugins?: SlatePlugin[]) => {
    const draggableOptions = [...baseDraggableComponentOptions, ...draggableConfig].map(styleDraggableOptions);
    const copyableOptions = [] // IMPLEMENT ME

    const options = {
        ...defaultOptions,
        ...Object.fromEntries(draggableOptions),
    };

    const slatePlugins: SlatePlugin[] = [...basePlugins].map(plugin => plugin(options))
    return [...slatePlugins, ...baseBehaviorPlugins, ...additionalPlugins]
}


export const setEditorNormalizers = (draggableConfig: DraggableNodeConfig[], additionalNormalizers?: SlateNormalizer[]) => {
    const draggableOptions = [...baseDraggableComponentOptions, ...draggableConfig].map(styleDraggableOptions);
    const copyableOptions = [] // IMPLEMENT ME

    const options = {
        ...defaultOptions,
        ...Object.fromEntries(draggableOptions),
    };

    return [...baseNormalizers, withLink(options), ...additionalNormalizers]
}
