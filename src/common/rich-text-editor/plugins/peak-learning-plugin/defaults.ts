import {BlockquotePluginOptionsValues} from "@udecode/slate-plugins";
import {PeakLearning} from "./component/PeakLearning";

export declare type PeakLearningKeyOption = 'learning';
export const PEAK_LEARNING = "learning";

export const DEFAULTS_LEARNING: Record<
    PeakLearningKeyOption,
    BlockquotePluginOptionsValues
    > = {
    learning: {
        component: PeakLearning,
        type: "learning",
        rootProps: {
            className: `slate-PLUGIN-peak-learning`,
            as: PEAK_LEARNING,
        },
    },
};
