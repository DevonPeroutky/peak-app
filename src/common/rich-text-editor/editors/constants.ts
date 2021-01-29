import {Node} from "slate";
import {ELEMENT_PARAGRAPH} from "@udecode/slate-plugins";
import moment from "moment";

export const EMPTY_PARAGRAPH_NODE: () => Node = () =>  { return { type: ELEMENT_PARAGRAPH, children: [{ text: ''}], id: getNodeId()} }
export const getNodeId: () => number = () => moment().valueOf()
