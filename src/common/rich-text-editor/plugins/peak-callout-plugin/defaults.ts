import {BlockquotePluginOptionsValues} from "@udecode/slate-plugins";
import {PeakCallout} from "./component/PeakCallout";

export declare type PeakCalloutKeyOption = 'callout';
export const PEAK_CALLOUT = "callout";

export const DEFAULTS_CALLOUT: Record<
    PeakCalloutKeyOption,
    BlockquotePluginOptionsValues
    > = {
    callout: {
        component: PeakCallout,
        type: "callout",
        rootProps: {
            className: `slate-PLUGIN-peak-callout`,
            as: 'callout',
        },
    },
};
