import 'tippy.js/dist/tippy.css';
import React, { useMemo } from 'react';
import {
    createAutoformatPlugin,
    createBlockquotePlugin,
    createBoldPlugin,
    createCodeBlockPlugin,
    createCodePlugin,
    createExitBreakPlugin,
    createHeadingPlugin,
    createHighlightPlugin,
    createHistoryPlugin,
    createImagePlugin,
    createItalicPlugin,
    createKbdPlugin,
    createLinkPlugin,
    createListPlugin,
    createMediaEmbedPlugin,
    createNodeIdPlugin,
    createNormalizeTypesPlugin,
    createParagraphPlugin,
    createReactPlugin,
    createResetNodePlugin,
    createSelectOnBackspacePlugin,
    createSlatePluginsComponents,
    createSlatePluginsOptions,
    createSoftBreakPlugin,
    createStrikethroughPlugin,
    createSubscriptPlugin,
    createSuperscriptPlugin,
    createTablePlugin,
    createTodoListPlugin,
    createTrailingBlockPlugin,
    createUnderlinePlugin,
    ELEMENT_H1,
    ELEMENT_IMAGE,
    ELEMENT_PARAGRAPH,
    SlatePlugin,
} from '@udecode/slate-plugins';
import {PEAK_AUTOFORMAT_OPTIONS} from "./plugins/withAutoReplace";
import {defaultOptions, PEAK_EXIT_BREAK_OPTIONS, PEAK_RESET_BLOCK_OPTIONS, PEAK_SOFT_BREAK_OPTIONS} from "./options";
import {PeakLinkPlugin} from "./plugins/peak-link-plugin/PeakLinkPlugin";
import {PeakCalloutPlugin} from "./plugins/peak-callout-plugin/PeakCalloutPlugin";
import {PeakKnowledgePlugin} from "./plugins/peak-knowledge-plugin/PeakKnowledgePlugin";

/**
 // THE OG PLUGINS
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
     CodeBlockPlugin,
     PeakHeadingPlugin,
     // PeakCodePlugin,
     PeakLinkPlugin,
     PeakCalloutPlugin,
     PeakKnowledgePlugin
 ];

 const baseNormalizers = [
     withReact,
     withHistory,
     withLink(),
     withImageUpload(),
     withAutoformat(PEAK_AUTOFORMAT_OPTIONS),
     withNodeID(),
     withAutoReplace,
 ];
**/

export const basePlugins: SlatePlugin[] = [
    createReactPlugin(),
    createHistoryPlugin(),
    createParagraphPlugin(),
    createBlockquotePlugin(),
    createTodoListPlugin(),
    createHeadingPlugin(),
    createImagePlugin(),
    createListPlugin(),
    createMediaEmbedPlugin(),
    createCodeBlockPlugin(),
    createBoldPlugin(),
    createCodePlugin(),
    createItalicPlugin(),
    createHighlightPlugin(),
    createUnderlinePlugin(),
    createStrikethroughPlugin(),
    createSubscriptPlugin(),
    createSuperscriptPlugin(),
    createKbdPlugin(),
    createNodeIdPlugin(),
    createAutoformatPlugin(PEAK_AUTOFORMAT_OPTIONS),
    createResetNodePlugin(PEAK_RESET_BLOCK_OPTIONS),
    createSoftBreakPlugin(PEAK_SOFT_BREAK_OPTIONS),
    createExitBreakPlugin(PEAK_EXIT_BREAK_OPTIONS),
    createTrailingBlockPlugin({
        type: defaultOptions[ELEMENT_PARAGRAPH].type,
        level: 1,
    }),
    // TODO: WTF is this
    createSelectOnBackspacePlugin({ allow: defaultOptions[ELEMENT_IMAGE].type }),


    // TODO: Remove this
    createLinkPlugin(),
    // PeakLinkPlugin(),
    // Custom Peak Plugins
    // PeakCodePlugin,
    // PeakCalloutPlugin(),
    // PeakKnowledgePlugin()
];
