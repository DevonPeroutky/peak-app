import {PeakKnowledgeNode} from "../../components/peak-knowledge-node/PeakKnowledgeNode";
import {BlockquotePluginOptionsValues} from "@udecode/slate-plugins";

export declare type PeakLearningKeyOption = 'peak_book_note';
export const ELEMENT_PEAK_BOOK = "peak_book_note";
export const PEAK_BOOK_SELECT_ITEM = "peak-book-select-item"

export const DEFAULTS_PEAK_BOOK: Record<
    PeakLearningKeyOption,
    BlockquotePluginOptionsValues
    > = {
    peak_book_note: {
        component: PeakKnowledgeNode,
        type: ELEMENT_PEAK_BOOK,
        rootProps: {
            className: `slate-PLUGIN-peak-book`,
            as: ELEMENT_PEAK_BOOK
        },
    },
};

