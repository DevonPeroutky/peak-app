import {BlockquotePluginOptionsValues} from "@udecode/slate-plugins";
import {PeakKnowledgeNode} from "../../components/peak-knowledge-node/PeakKnowledgeNode";

export declare type PeakLearningKeyOption = 'learning';
export const PEAK_LEARNING = "learning";

export const DEFAULTS_LEARNING: Record<
    PeakLearningKeyOption,
    BlockquotePluginOptionsValues
    > = {
    learning: {
        component: PeakKnowledgeNode,
        type: PEAK_LEARNING,
        rootProps: {
            className: `slate-PLUGIN-peak-learning`,
            as: PEAK_LEARNING,
        },
    },
};
