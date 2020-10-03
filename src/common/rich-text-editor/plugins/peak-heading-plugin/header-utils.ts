import {Editor, Transforms} from "slate";
import {ELEMENT_PARAGRAPH, isNodeTypeIn} from "@udecode/slate-plugins";
import {v4 as uuidv4} from "uuid";

export const toggleHeader = (editor: Editor, format: string ) => {
    if (isNodeTypeIn(editor, format) || format as string === ELEMENT_PARAGRAPH ) {
       resetHeader(editor)
    } else {
        const headerId = uuidv4()
        Transforms.setNodes(editor, {
            type: format,
            header_id: headerId
        })
    }
}

export const resetHeader = (editor: Editor) => {
    Transforms.setNodes(editor, {
        type: ELEMENT_PARAGRAPH,
        header_id: null
    })
}