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
    createParagraphPlugin,
    createReactPlugin,
    createResetNodePlugin,
    createSelectOnBackspacePlugin,
    createSoftBreakPlugin,
    createStrikethroughPlugin,
    createSubscriptPlugin,
    createSuperscriptPlugin,
    createTodoListPlugin,
    createTrailingBlockPlugin,
    createUnderlinePlugin,
    ELEMENT_IMAGE,
    ELEMENT_PARAGRAPH,
    SlatePlugin,
} from '@udecode/slate-plugins';
import {PEAK_AUTOFORMAT_OPTIONS} from "./plugins/withAutoReplace";
import {defaultOptions, PEAK_EXIT_BREAK_OPTIONS, PEAK_RESET_BLOCK_OPTIONS, PEAK_SOFT_BREAK_OPTIONS} from "./options";
import {createPeakCalloutPlugin} from "./plugins/peak-callout-plugin/PeakCalloutPlugin";
import { createPeakLearningPlugin } from './plugins/peak-knowledge-plugin/PeakKnowledgePlugin';
import {createPeakLinkPlugin} from "./plugins/peak-link-plugin/PeakLinkPlugin";
import {createPeakMediaEmbedPlugin} from "./plugins/peak-media-embed-plugin/createPeakMediaEmbedPlugin";
import {createDividerPlugin} from "./plugins/peak-divider/createDividerPlugin";

/**
 // THE OG PLUGINS
 const basePlugins = [
     ImagePlugin,
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
    }),
    createPeakLinkPlugin(),
    createPeakCalloutPlugin(),
    createPeakLearningPlugin(),
    createPeakMediaEmbedPlugin(),

    // TODO: submit this as an open-source plugin
    createDividerPlugin(),

    // TODO: WTF is this
    createSelectOnBackspacePlugin({ allow: defaultOptions[ELEMENT_IMAGE].type }),
];
