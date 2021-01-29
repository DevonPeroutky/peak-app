import {Node} from "slate";
import {ELEMENT_BLOCKQUOTE} from "@udecode/slate-plugins";
import moment from "moment";
import {EMPTY_PARAGRAPH_NODE} from "../../../common/rich-text-editor/editors/constants";

export const addSelectionAsBlockQuote = (text: string) => {
    const node_id2: number = moment().valueOf()
    const blockquoteNode: Node = { children: [{text: text}], type: ELEMENT_BLOCKQUOTE, id: node_id2 }
    return [blockquoteNode, EMPTY_PARAGRAPH_NODE]
}