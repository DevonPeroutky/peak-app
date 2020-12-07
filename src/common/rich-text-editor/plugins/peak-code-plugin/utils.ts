import {Editor, Transforms} from "slate";
import {ELEMENT_CODE_BLOCK} from "@udecode/slate-plugins";
import {store} from "../../../../redux/store";
import {setEditorFocusToNode} from "../../../../redux/wikiPageSlice";

export const createAndFocusCodeBlock = (editor: Editor) => {
    const nodeId = Date.now()

    // Transforms.removeNodes(editor)
    Transforms.insertNodes(editor, {
        type: ELEMENT_CODE_BLOCK,
        id: nodeId,
        children: [{text: ''}]
    });
    const pageId = window.location.href.split("/").pop()
    store.dispatch(setEditorFocusToNode({pageId: pageId!, nodeId: nodeId, focused: true}))
}
