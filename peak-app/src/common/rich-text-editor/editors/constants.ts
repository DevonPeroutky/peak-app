import {Node} from "slate";
import {ELEMENT_PARAGRAPH} from "@udecode/slate-plugins";
import moment from "moment";
import {ELEMENT_TITLE} from "component-library";

export const EMPTY_PARAGRAPH_NODE: () => Node = () =>  { return { type: ELEMENT_PARAGRAPH, children: [{ text: ''}], id: getNodeId()} }
export const getNodeId: () => number = () => moment().valueOf()
// @ts-ignore
export const EMPTY_BODY_WITH_TITLE: Node[] = [{ type: ELEMENT_TITLE, children: [{ text: ''}] }, EMPTY_PARAGRAPH_NODE()]
