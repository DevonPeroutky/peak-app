import {
    ELEMENT_OL,
    ELEMENT_UL,
    toggleList
} from "@udecode/slate-plugins";
import {ReactEditor} from "slate-react";

export const baseKeyBindingHandler = (event: any, editor: ReactEditor) => {
    const currentPath = editor.selection?.anchor.path
    if (currentPath === undefined)  { return }

    if (event.shiftKey && event.key == '8') {
        toggleList(editor, { typeList: ELEMENT_UL })
    }

    if (event.shiftKey && event.key == '9') {
        toggleList(editor, { typeList: ELEMENT_OL })
    }

}

