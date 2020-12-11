import {
    getRenderElement,
    setDefaults,
    SlatePlugin,
} from "@udecode/slate-plugins";
import {DEFAULTS_LEARNING} from "./defaults";
import {learningOnKeyDownHandler} from "./utils";

export const PeakLearningPlugin = (options?: any): SlatePlugin => ({
    renderElement: renderElementPeakLearning(options),
    onKeyDown: learningOnKeyDownHandler()
});

const renderElementPeakLearning = (
    options?: any
) => {
    const { learning } = setDefaults(options, DEFAULTS_LEARNING);
    return getRenderElement(learning);
};
