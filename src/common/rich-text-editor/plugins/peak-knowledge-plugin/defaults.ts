import {PeakKnowledgeNode} from "./components/peak-knowledge-node/PeakKnowledgeNode";
import {BlockquotePluginOptionsValues} from "@udecode/slate-plugins";
import {PeakKnowledgeKeyOption} from "./types";
import {ELEMENT_PEAK_BOOK, PEAK_LEARNING} from "./constants";

export const DEFAULTS_PEAK_KNOWLEDGE: Record<
    PeakKnowledgeKeyOption,
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
    learning: {
        component: PeakKnowledgeNode,
        type: PEAK_LEARNING,
        rootProps: {
            className: `slate-PLUGIN-peak-learning`,
            as: PEAK_LEARNING,
        },
    },
};

