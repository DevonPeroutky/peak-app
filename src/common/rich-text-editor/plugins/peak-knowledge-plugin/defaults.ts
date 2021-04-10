import {PeakKnowledgeNode} from "./components/peak-knowledge-node/PeakKnowledgeNode";
import {ELEMENT_PEAK_BOOK, ELEMENT_WEB_NOTE, PEAK_LEARNING} from "./constants";
import {PeakLearningNode} from "./components/peak-learning-node/PeakLearningNode";
import {SlatePluginOptions} from "@udecode/slate-plugins";
import {PeakSlatePluginKey} from "../../types";

export const DEFAULTS_PEAK_KNOWLEDGE:
    Partial<Record<PeakSlatePluginKey, Partial<SlatePluginOptions>>> = {
    peak_web_note: {
        component: PeakKnowledgeNode,
        type: ELEMENT_WEB_NOTE,
        rootProps: {
            className: `slate-PLUGIN-peak-web-note`,
            as: ELEMENT_WEB_NOTE
        },
    },
    peak_book_note: {
        component: PeakKnowledgeNode,
        type: ELEMENT_PEAK_BOOK,
        rootProps: {
            className: `slate-PLUGIN-peak-book`,
            as: ELEMENT_PEAK_BOOK
        },
    },
    learning: {
        component: PeakLearningNode,
        type: PEAK_LEARNING,
        rootProps: {
            className: `slate-PLUGIN-peak-learning`,
            as: PEAK_LEARNING,
        },
    },
};

