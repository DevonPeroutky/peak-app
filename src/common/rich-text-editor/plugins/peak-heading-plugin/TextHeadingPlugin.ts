import {Editor} from "slate";
import {renderElementHeading} from "./renderElementHeading";
import {
    deserializeHeading,
    ELEMENT_H1,
    ELEMENT_H2,
    ELEMENT_H3,
    ELEMENT_H4,
    ELEMENT_H5,
    HeadingPluginOptions,
    SlatePlugin,
} from "@udecode/slate-plugins";
import {resetHeader, toggleHeader} from "./header-utils";

export const PeakHeadingPlugin = (options?: HeadingPluginOptions): SlatePlugin => ({
    renderElement: renderElementHeading(options),
    deserialize: deserializeHeading({ levels: options?.levels }),
    onKeyDown: peakOnKeyDownTextHeading(options),
});

const peakOnKeyDownTextHeading = (options?: HeadingPluginOptions) => (event: KeyboardEvent, editor: Editor) => {
    if (event.metaKey && event.altKey) {
        switch (event.keyCode) {
            case 48:
                event.preventDefault()
                return resetHeader(editor)
            case 49:
                event.preventDefault()
                // return toggleNodeType(editor, { activeType: ELEMENT_H1 })
                return toggleHeader(editor, ELEMENT_H1)
            case 50:
                event.preventDefault()
                return toggleHeader(editor, ELEMENT_H2)
            case 51:
                event.preventDefault()
                return toggleHeader(editor, ELEMENT_H3)
            case 52:
                event.preventDefault()
                return toggleHeader(editor, ELEMENT_H4)
            case 53:
                event.preventDefault();
                return toggleHeader(editor, ELEMENT_H5)
            default:
                return
        }
    }
};
