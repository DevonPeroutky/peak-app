import {
    BlockquotePlugin, BoldPlugin,
    CodePlugin,
    ELEMENT_CODE_BLOCK, ImagePlugin, ItalicPlugin,
    ListPlugin,
    ParagraphPlugin,
    SlatePlugin, StrikethroughPlugin, UnderlinePlugin,
    withInlineVoid
} from "@udecode/slate-plugins";
import {baseBehaviorPlugins, setEditorNormalizers, setEditorPlugins, snowflakePlugins} from "../../base_config";
import {PeakHeadingPlugin} from "../../plugins/peak-heading-plugin/PeakHeadingPlugin";
import {PeakCodePlugin} from "../../plugins/peak-code-plugin/PeakCodePlugin";
import {PeakLinkPlugin} from "../../plugins/peak-link-plugin/PeakLinkPlugin";
import {PeakCalloutPlugin} from "../../plugins/peak-callout-plugin/PeakCalloutPlugin";
import {PeakKnowledgePlugin} from "../../plugins/peak-knowledge-plugin/PeakKnowledgePlugin";
import {defaultOptions} from "../../defaults";
import {JOURNAL_ENTRY_HEADER, SlateNormalizer} from "../../types";
import {withEditableJournalEntry} from "../../plugins/journal-entry-plugin/withEditableJournalEntry";
import {JOURNAL_NODE_LEVEL, journalPlugins} from "../journal/config";

export const NODE_LEVEL: number = 1
const basePlugins: SlatePlugin[] = [
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
    PeakCalloutPlugin
].map(plugin => plugin(defaultOptions))

export const chromeExtensionPlugins =  [...basePlugins, ...baseBehaviorPlugins, ...snowflakePlugins(NODE_LEVEL)]
export const chromeExtensionNormalizers = setEditorNormalizers(NODE_LEVEL, [
    withInlineVoid({ plugins: journalPlugins, voidTypes: [ELEMENT_CODE_BLOCK] })
], false)
