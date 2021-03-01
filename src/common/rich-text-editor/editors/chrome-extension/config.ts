import {
    BlockquotePlugin,
    BoldPlugin,
    CodePlugin,
    ELEMENT_PARAGRAPH,
    ImagePlugin,
    ItalicPlugin,
    LinkPlugin,
    ListPlugin,
    ParagraphPlugin,
    StrikethroughPlugin, UnderlinePlugin, withAutoformat, withImageUpload,
    withInlineVoid, withLink, withList, withNodeID, withTrailingNode
} from "@udecode/slate-plugins";
import {
    baseBehaviorPlugins,
    baseOptions,
    snowflakePlugins
} from "../../base_config";
import {PeakHeadingPlugin} from "../../plugins/peak-heading-plugin/PeakHeadingPlugin";
import {PeakCalloutPlugin} from "../../plugins/peak-callout-plugin/PeakCalloutPlugin";
import {defaultOptions} from "../../defaults";
import {PEAK_VOID_TYPES, StyledNodeConfig} from "../../types";
import {withReact} from "slate-react";
import {withHistory} from "slate-history";
import {chromeExtFormatRules, withAutoReplace} from "../../plugins/withAutoReplace";

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
        rules: chromeExtFormatRules,
    }),
    withNodeID(),
    withAutoReplace,
];
const normalizers = [
    ...baseNormalizers,
    withList(options),
    withInlineVoid({ plugins: plugins, voidTypes: PEAK_VOID_TYPES }),
    withTrailingNode({ type: ELEMENT_PARAGRAPH, level: 1 })
]

export const chromeExtensionPlugins =  [...plugins, ...baseBehaviorPlugins, ...snowflakePlugins(NODE_LEVEL)]
export const chromeExtensionNormalizers = normalizers
