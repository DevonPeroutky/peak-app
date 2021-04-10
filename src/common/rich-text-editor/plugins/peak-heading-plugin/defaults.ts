import {
    ELEMENT_H1,
    ELEMENT_H2,
    ELEMENT_H3,
    ELEMENT_H4,
    ELEMENT_H5,
    ELEMENT_H6,
    SlatePluginOptions,
} from "@udecode/slate-plugins";
import {PeakHeading} from "./component/renderElementHeading";
import {PeakSlatePluginKey} from "../../types";

// Partial<Record<PeakSlatePluginKey, Partial<SlatePluginOptions>>>
export const DEFAULTS_PEAK_HEADING:
    Partial<Record<PeakSlatePluginKey, Partial<SlatePluginOptions>>> = {
    h1: {
        component: PeakHeading,
        type: ELEMENT_H1,
        rootProps: {
            className: `slate-peak-${ELEMENT_H1}`,
            as: 'h1',
        },
    },
    h2: {
        component: PeakHeading,
        type: ELEMENT_H2,
        rootProps: {
            className: `slate-peak-${ELEMENT_H2}`,
            as: 'h2',
        },
    },
    h3: {
        component: PeakHeading,
        type: ELEMENT_H3,
        rootProps: {
            className: `slate-peak-${ELEMENT_H3}`,
            as: 'h3',
        },
    },
    h4: {
        component: PeakHeading,
        type: ELEMENT_H4,
        rootProps: {
            className: `slate-peak-${ELEMENT_H4}`,
            as: 'h4',
        },
    },
    h5: {
        component: PeakHeading,
        type: ELEMENT_H5,
        rootProps: {
            className: `slate-peak-${ELEMENT_H5}`,
            as: 'h5',
        },
    },
    h6: {
        component: PeakHeading,
        type: ELEMENT_H6,
        rootProps: {
            className: `slate-peak-${ELEMENT_H6}`,
            as: 'h6',
        },
    },
};