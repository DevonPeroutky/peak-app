import {
    getRenderElement,
    setDefaults,
    SlatePlugin,
} from "@udecode/slate-plugins";
import {DEFAULTS_PEAK_KNOWLEDGE} from "./defaults";
import {knowledgeNodeOnKeyDownHandler} from "../../utils/peak-knowledge-node-utils";

export const PeakKnowledgePlugin = (options?: any): SlatePlugin => ({
    renderElement: renderPeakKnowledgeNode(options),
    onKeyDown: knowledgeNodeOnKeyDownHandler
});

const renderPeakKnowledgeNode = (
    options?: any
) => {
    console.log(`THE OPTIONS`)
    console.log(options)
    const { learning, peak_book_note } = setDefaults(options, DEFAULTS_PEAK_KNOWLEDGE);
    return getRenderElement(learning);
};
