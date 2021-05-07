import {
    ELEMENT_OL,
    ELEMENT_UL,
    SPEditor,
    toggleList
} from "@udecode/slate-plugins";

export const baseKeyBindingHandler = (event: any, editor: SPEditor) => {
    const currentPath = editor.selection?.anchor.path
    if (currentPath === undefined)  { return }

    if (event.shiftKey && event.key == '8') {
        toggleList(editor, { type: ELEMENT_UL })
    }

    if (event.shiftKey && event.key == '9') {
        toggleList(editor, { type: ELEMENT_OL })
    }
}

