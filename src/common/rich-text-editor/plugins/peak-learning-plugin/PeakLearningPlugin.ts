import {
    getRenderElement,
    setDefaults,
    SlatePlugin,
} from "@udecode/slate-plugins";
import {DEFAULTS_LEARNING} from "./defaults";
import {knowledgeNodeOnKeyDownHandler} from "../../utils/peak-knowledge-node-utils";

export const PeakLearningPlugin = (options?: any): SlatePlugin => ({
    renderElement: renderElementPeakLearning(options),
    onKeyDown: knowledgeNodeOnKeyDownHandler
});

const renderElementPeakLearning = (
    options?: any
) => {
    const { learning } = setDefaults(options, DEFAULTS_LEARNING);
    return getRenderElement(learning);
};
