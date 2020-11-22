import {Editor, Transforms} from "slate";
import {v4 as uuidv4} from "uuid";
import {ELEMENT_CODE_BLOCK, ELEMENT_PARAGRAPH, unwrapList} from "@udecode/slate-plugins";
import {store} from "../../../../redux/store";
import {setEditorFocusToNode} from "../../../../redux/wikiPageSlice";
import {PEAK_LEARNING} from "./defaults";

export const createLearning = (editor: Editor) => {
    unwrapList(editor);
    // Transforms.removeNodes(editor)
    Transforms.insertNodes(editor, {
        type: PEAK_LEARNING,
        children: [{children: [{text: ''}], type: ELEMENT_PARAGRAPH}]
    });
}
