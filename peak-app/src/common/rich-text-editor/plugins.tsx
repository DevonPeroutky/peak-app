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
import {createPeakCalloutPlugin} from "./plugins/peak-callout-plugin/PeakCalloutPlugin";
import { createPeakLearningPlugin } from './plugins/peak-knowledge-plugin/PeakKnowledgePlugin';
import {createPeakLinkPlugin} from "./plugins/peak-link-plugin/PeakLinkPlugin";
import {createDividerPlugin} from "./plugins/peak-divider/createDividerPlugin";
import {corePlugins} from "component-library/dist";

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
const basePlugins: SlatePlugin[] = [
    ...openSourcePlugins,
    createPeakCalloutPlugin(),
    // TODO: submit this as an open-source plugin
    createDividerPlugin(),
]
const customPeakPlugins: SlatePlugin[] = [
    createPeakLinkPlugin(),
    createPeakLearningPlugin(),
]
const peakPlugins: SlatePlugin[] = [
    ...openSourcePlugins,
    ...corePlugins,
    ...customPeakPlugins
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
        const plugins = (additionalPlugins) ? [...basePlugins, ...additionalPlugins] : basePlugins
        plugins.push(createDeserializeHTMLPlugin({ plugins }));

        return plugins
    }, [additionalPlugins, defaultOptions])
}
