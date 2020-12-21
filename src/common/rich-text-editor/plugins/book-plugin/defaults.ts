import {MentionPluginOptionsValues} from "@udecode/slate-plugins";
import { PeakBookNote } from "./components/PeakBookNote";

export declare type PeakLearningKeyOption = 'peakBookNote';
export const ELEMENT_PEAK_BOOK = "peak-book-note";
export const PEAK_BOOK_SELECT_ITEM = "peak-book-select-item"

export const DEFAULTS_PEAK_BOOK: Record<
    PeakLearningKeyOption,
    MentionPluginOptionsValues
    > = {
    peakBookNote: {
        component: PeakBookNote,
        type: ELEMENT_PEAK_BOOK,
        rootProps: {
            className: `slate-PLUGIN-peak-book`,
            prefix: '/'
        },
    },
};

