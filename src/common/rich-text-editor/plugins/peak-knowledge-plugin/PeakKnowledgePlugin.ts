import {
    getRenderElements,
    RenderNodeOptions,
    setDefaults,
    SlatePlugin,
} from "@udecode/slate-plugins";
import {DEFAULTS_PEAK_KNOWLEDGE} from "./defaults";
import {knowledgeNodeOnKeyDownHandler} from "./peak-knowledge-node-utils";
import { RenderElementProps } from "slate-react";

export const PeakKnowledgePlugin = (options?: any): SlatePlugin => ({
    renderElement: renderPeakKnowledgeNode(options),
    onKeyDown: knowledgeNodeOnKeyDownHandler
});

const renderPeakKnowledgeNode = (
    options?: any
) => (props: RenderElementProps) => {
    const { learning, peak_book_note } = setDefaults(options, DEFAULTS_PEAK_KNOWLEDGE);
    const renderElementsOptions: Required<RenderNodeOptions>[] = [learning, peak_book_note];
    return getRenderElements(renderElementsOptions)(props);
};
