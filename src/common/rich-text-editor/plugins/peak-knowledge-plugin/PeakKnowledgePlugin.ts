import {
    getRenderElements,
    setDefaults,
    SlatePlugin,
} from "@udecode/slate-plugins";
import {DEFAULTS_PEAK_KNOWLEDGE} from "./defaults";
import {knowledgeNodeOnKeyDownHandler} from "./utils";
import { RenderElementProps } from "slate-react";

export const PeakKnowledgePlugin = (options?: any): SlatePlugin => ({
    renderElement: renderPeakKnowledgeNode(options),
    onKeyDown: knowledgeNodeOnKeyDownHandler
});

const renderPeakKnowledgeNode = (
    options?: any
) => (props: RenderElementProps) => {
    const { learning, peak_book_note, peak_web_note } = setDefaults(options, DEFAULTS_PEAK_KNOWLEDGE);
    return getRenderElements([learning, peak_book_note, peak_web_note])(props);
};
