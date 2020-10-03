import {
    CodePluginOptions,
    deserializeCode, ELEMENT_CODE_BLOCK,
    SlatePlugin, unwrapList
} from "@udecode/slate-plugins";
import {renderCustomPeakElement} from "../custom-renderer";
import {Editor, Transforms} from "slate";
import {v4 as uuidv4} from "uuid";
import {store} from "../../../../redux/store";
import {setCodeEditorFocus} from "../../../../redux/wikiPageSlice";
const R = require('ramda');

export const PeakCodePlugin = (options?: CodePluginOptions): SlatePlugin => ({
    renderElement: renderCustomPeakElement(options),
    deserialize: deserializeCode(),
});


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
    store.dispatch(setCodeEditorFocus({pageId: pageId!, codeEditorId: codeId, focused: true}))
}
