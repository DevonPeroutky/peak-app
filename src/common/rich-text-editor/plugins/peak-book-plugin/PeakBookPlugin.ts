import {
    getRenderElement,
    setDefaults,
    SlatePlugin,
} from "@udecode/slate-plugins";
import {DEFAULTS_PEAK_BOOK} from "./defaults";
import {knowledgeNodeOnKeyDownHandler} from "../../utils/peak-knowledge-node-utils";

export const PeakBookNotePlugin = (options?: any): SlatePlugin => ({
    renderElement: renderElementPeakBook(options),
    onKeyDown: knowledgeNodeOnKeyDownHandler
});

const renderElementPeakBook = (
    options?: any
) => {
    const { peak_book_note } = setDefaults(options, DEFAULTS_PEAK_BOOK);
    return getRenderElement(peak_book_note);
};
