import {BlockquotePluginOptionsValues} from "@udecode/slate-plugins";
import {PEAK_NOTE_STUB, PeakNoteStubKeyOption} from "./types";
import {PeakNoteStub} from "./components/PeakNoteStub";

export const DEFAULTS_PEAK_NOTE_STUB: Record<
    PeakNoteStubKeyOption,
    BlockquotePluginOptionsValues
    > = {
    peak_note_stub: {
        component: PeakNoteStub,
        type: PEAK_NOTE_STUB,
        rootProps: {
            className: `slate-PLUGIN-peak-web-note`,
            as: PEAK_NOTE_STUB
        },
    },
};

