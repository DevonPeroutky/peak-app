import {MentionNodeData, MentionPluginOptionsValues} from "@udecode/slate-plugins";
import { PeakBookNote } from "./components/PeakBookNote";

export declare type PeakLearningKeyOption = 'peakBookNote';
export const ELEMENT_PEAK_BOOK = "peak-book-note";

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


export const TEST_BOOKS: MentionNodeData[] = [
    { value: 'Aayla Secura' },
    { value: 'Adi Gallia' },
    { value: 'Admiral Dodd Rancit' },
    { value: 'Admiral Firmus Piett' },
    { value: 'Admiral Gial Ackbar' },
    { value: 'Admiral Ozzel' },
]