import 'tippy.js/dist/tippy.css';
import React, { useMemo } from 'react';
import {
    createAutoformatPlugin,
    createDeserializeHTMLPlugin,
    createExitBreakPlugin,
    createHistoryPlugin,
    createKbdPlugin,
    createListPlugin,
    createNodeIdPlugin,
    createReactPlugin,
    createResetNodePlugin,
    createSelectOnBackspacePlugin,
    createSoftBreakPlugin,
    createTrailingBlockPlugin,
    ELEMENT_IMAGE,
    ELEMENT_PARAGRAPH,
    SlatePlugin,
} from '@udecode/slate-plugins';
import {PEAK_AUTOFORMAT_OPTIONS} from "./plugins/withAutoReplace";
import {defaultOptions, PEAK_EXIT_BREAK_OPTIONS, PEAK_RESET_BLOCK_OPTIONS, PEAK_SOFT_BREAK_OPTIONS} from "./options";
import { createPeakLearningPlugin } from './plugins/peak-knowledge-plugin/PeakKnowledgePlugin';
import { createPeakLinkPlugin } from "./plugins/peak-link-plugin/PeakLinkPlugin";
import {basePlugins} from "component-library/dist";

const openSourcePlugins: SlatePlugin[] = [
    createReactPlugin(),
    createHistoryPlugin(),
    createNodeIdPlugin(),
    createKbdPlugin(),
    createListPlugin(),
    createAutoformatPlugin(PEAK_AUTOFORMAT_OPTIONS),
    createResetNodePlugin(PEAK_RESET_BLOCK_OPTIONS),
    createSoftBreakPlugin(PEAK_SOFT_BREAK_OPTIONS),
    createExitBreakPlugin(PEAK_EXIT_BREAK_OPTIONS),
    createTrailingBlockPlugin({
        type: defaultOptions[ELEMENT_PARAGRAPH].type,
    }),

    // TODO: WTF is this
    createSelectOnBackspacePlugin({ allow: defaultOptions[ELEMENT_IMAGE].type }),
];
const corePlugins: SlatePlugin[] = [
    ...openSourcePlugins,
    ...basePlugins
]
const peakPlugins: SlatePlugin[] = [
    ...corePlugins,
    createPeakLinkPlugin(),
    createPeakLearningPlugin()
]

export const usePeakPlugins = (additionalPlugins?: SlatePlugin[]) => {
    return useMemo(() => {
        const plugins = (additionalPlugins) ? [...peakPlugins, ...additionalPlugins] : peakPlugins
        plugins.push(createDeserializeHTMLPlugin({ plugins }));

        return plugins
    }, [additionalPlugins, defaultOptions])
}
export const useBasicPlugins = (additionalPlugins?: SlatePlugin[]) => {
    return useMemo(() => {
        const plugins = (additionalPlugins) ? [...corePlugins, ...additionalPlugins] : corePlugins
        plugins.push(createDeserializeHTMLPlugin({ plugins }));

        return plugins
    }, [additionalPlugins, defaultOptions])
}
