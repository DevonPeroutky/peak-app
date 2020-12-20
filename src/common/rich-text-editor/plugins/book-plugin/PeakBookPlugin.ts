import { SlatePlugin } from '@udecode/slate-plugins-core';
import {
    getRenderElement,
    MentionPluginOptions,
    setDefaults
} from "@udecode/slate-plugins";
import {DEFAULTS_PEAK_BOOK} from "./defaults";
import {knowledgeNodeOnKeyDownHandler} from "../../utils/peak-knowledge-node-utils";

export const PeakBookNotePlugin = (options?: MentionPluginOptions): SlatePlugin => {
    return {
        renderElement: renderElementPeakBook(options),
        onKeyDown: knowledgeNodeOnKeyDownHandler
    };
};

const renderElementPeakBook = (
    options?: any
) => {
    const { peakBookNote } = setDefaults(options, DEFAULTS_PEAK_BOOK);
    return getRenderElement(peakBookNote);
};
