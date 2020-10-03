import {
    deserializeStrikethrough,
    getRenderLeafDefault,
    MarkOnKeyDownOptions,
    onKeyDownMarkDefault,
    StrikethroughPluginOptions,
    StrikethroughPluginOptionsValues,
    StrikethroughRenderLeafOptions,
    StyledLeaf
} from "@udecode/slate-plugins";
import { SlatePlugin } from '@udecode/slate-plugins-core';

export const PeakCompletedPlugin = (
    options?: StrikethroughPluginOptions
): SlatePlugin => ({
    renderLeaf: renderLeafCompleted(options),
    deserialize: deserializeStrikethrough(options),
    onKeyDown: onKeyDownMarkDefault({
        key: 'completed',
        defaultOptions: DEFAULTS_COMPLETED,
        options,
    }),
});

export const renderLeafCompleted = (
    options?: StrikethroughRenderLeafOptions
) =>
    getRenderLeafDefault({
        key: 'completed',
        defaultOptions: DEFAULTS_COMPLETED,
        options,
    });


export declare type CompletedKeyOption = 'completed';
export const PEAK_MARK_COMPLETED = 'completed';

export const DEFAULTS_COMPLETED: Record<
    CompletedKeyOption,
    StrikethroughPluginOptionsValues & MarkOnKeyDownOptions
    > = {
    completed: {
        component: StyledLeaf,
        type: PEAK_MARK_COMPLETED,
        hotkey: 'mod+enter',
        rootProps: {
            className: `slate-peak-completed`,
            as: 's',
        },
    },
};