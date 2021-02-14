import {
    getRenderElements,
    setDefaults,
    SlatePlugin,
} from "@udecode/slate-plugins";
import { RenderElementProps } from "slate-react";
import {DEFAULTS_PEAK_NOTE_STUB} from "./defaults";

export const PeakNoteStubPlugin = (options?: any): SlatePlugin => ({
    renderElement: renderPeakNoteStub(options),
});

const renderPeakNoteStub = (
    options?: any
) => (props: RenderElementProps) => {
    const { peak_note_stub } = setDefaults(options, DEFAULTS_PEAK_NOTE_STUB);
    return getRenderElements([peak_note_stub])(props);
};
