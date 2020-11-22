import {Editor, Transforms} from "slate";
import {v4 as uuidv4} from "uuid";
import {ELEMENT_CODE_BLOCK, unwrapList} from "@udecode/slate-plugins";
import {store} from "../../../../redux/store";
import {setEditorFocusToNode} from "../../../../redux/wikiPageSlice";

export const createAndFocusCodeBlock = (editor: Editor) => {
    const codeId = uuidv4()
    unwrapList(editor);
    Transforms.removeNodes(editor)
    Transforms.insertNodes(editor, {
        type: ELEMENT_CODE_BLOCK,
        code_id: codeId,
        children: [{text: ''}]
    });
    const pageId = window.location.href.split("/").pop()
    store.dispatch(setEditorFocusToNode({pageId: pageId!, nodeId: codeId, focused: true}))
}
