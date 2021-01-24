import {Node} from "slate";
import {ELEMENT_BLOCKQUOTE} from "@udecode/slate-plugins";
import moment from "moment";

export const addSelectionAsBlockQuote = (text: string) => {
    const node_id1: number = moment().valueOf()
    const node_id2: number = moment().valueOf()
    // const blockquoteNode: Node[] = [{ children: [{text: text}], type: ELEMENT_PARAGRAPH, id: node_id1 }, { children: [{text: text}], type: ELEMENT_BLOCKQUOTE, id: node_id2 }]
    const blockquoteNode: Node[] = [{ children: [{text: text}], type: ELEMENT_BLOCKQUOTE, id: node_id2 }]
    return blockquoteNode
}