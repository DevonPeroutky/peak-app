import {Node} from "slate";
import {ELEMENT_BLOCKQUOTE} from "@udecode/slate-plugins";
import {EMPTY_PARAGRAPH_NODE} from "../../../common/rich-text-editor/editors/constants";

export const addSelectionAsBlockQuote = (text: string, node_id: number) => {
    const blockquoteNode: Node = { children: [{text: text}], type: ELEMENT_BLOCKQUOTE, id: node_id }
    return [blockquoteNode, EMPTY_PARAGRAPH_NODE()]
}