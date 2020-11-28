import {
    getRenderElement,
    setDefaults,
    SlatePlugin,
} from "@udecode/slate-plugins";
import {DEFAULTS_LEARNING} from "./defaults";

export const PeakLearningPlugin = (options?: any): SlatePlugin => ({
    renderElement: renderElementPeakLearning(options),
});

const renderElementPeakLearning = (
    options?: any
) => {
    const { learning } = setDefaults(options, DEFAULTS_LEARNING);
    return getRenderElement(learning);
};
