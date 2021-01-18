import {
    BlockquotePlugin, BoldPlugin,
    CodePlugin,
    ELEMENT_CODE_BLOCK, ELEMENT_PARAGRAPH, getSelectableElement, ImagePlugin, ItalicPlugin, LinkPlugin,
    ListPlugin,
    ParagraphPlugin,
    SlatePlugin, StrikethroughPlugin, UnderlinePlugin, withAutoformat, withImageUpload,
    withInlineVoid, withLink, withList, withNodeID, withTrailingNode
} from "@udecode/slate-plugins";
import {
    baseBehaviorPlugins,
    baseOptions,
    setEditorNormalizers,
    setEditorPlugins,
    snowflakePlugins
} from "../../base_config";
import {PeakHeadingPlugin} from "../../plugins/peak-heading-plugin/PeakHeadingPlugin";
import {PeakCodePlugin} from "../../plugins/peak-code-plugin/PeakCodePlugin";
import {PeakLinkPlugin} from "../../plugins/peak-link-plugin/PeakLinkPlugin";
import {PeakCalloutPlugin} from "../../plugins/peak-callout-plugin/PeakCalloutPlugin";
import {PeakKnowledgePlugin} from "../../plugins/peak-knowledge-plugin/PeakKnowledgePlugin";
import {defaultOptions} from "../../defaults";
import {JOURNAL_ENTRY_HEADER, SlateNormalizer, StyledNodeConfig} from "../../types";
import {withEditableJournalEntry} from "../../plugins/journal-entry-plugin/withEditableJournalEntry";
import {JOURNAL_NODE_LEVEL, journalPlugins} from "../journal/config";
import {withReact} from "slate-react";
import {withHistory} from "slate-history";
import {autoformatRules, withAutoReplace} from "../../plugins/withAutoReplace";

export const NODE_LEVEL: number = 1
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
    LinkPlugin,
    PeakHeadingPlugin,
    PeakCalloutPlugin
]

const defaultStyleOptions = ({ type, rootProps, ...options}: StyledNodeConfig) => (
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
const levelAwareConfig = baseOptions.map(sup => {
    return {...sup, level: NODE_LEVEL}
})
const wtf = levelAwareConfig.map(defaultStyleOptions)
const options = { ...defaultOptions, ...Object.fromEntries(wtf) }
const plugins = basePlugins.map(plugin => plugin(options))

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
const normalizers = [
    ...baseNormalizers,
    withList(options),
    withInlineVoid({ plugins: journalPlugins, voidTypes: [ELEMENT_CODE_BLOCK] }),
    withTrailingNode({ type: ELEMENT_PARAGRAPH, level: 1 })
]

export const chromeExtensionPlugins =  [...plugins, ...baseBehaviorPlugins, ...snowflakePlugins(NODE_LEVEL)]
export const chromeExtensionNormalizers = normalizers
