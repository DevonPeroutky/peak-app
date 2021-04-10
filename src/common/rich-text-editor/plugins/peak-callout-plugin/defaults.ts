import {PeakCallout} from "./component/PeakCallout";
import {ELEMENT_PEAK_BOOK, ELEMENT_WEB_NOTE, PEAK_LEARNING} from "../peak-knowledge-plugin/constants";
import {PeakSlatePluginKey} from "../../types";
import {SlatePluginOptions} from "@udecode/slate-plugins";

export const PEAK_CALLOUT = "callout";
export declare type PeakCalloutKeyOption = typeof PEAK_CALLOUT

export const DEFAULTS_CALLOUT: Partial<Record<
    PeakSlatePluginKey,
    Partial<SlatePluginOptions>
    >> = {
    callout: {
        component: PeakCallout,
        type: "callout",
        rootProps: {
            className: `slate-PLUGIN-peak-callout`,
            as: PEAK_CALLOUT,
        },
    },
};
