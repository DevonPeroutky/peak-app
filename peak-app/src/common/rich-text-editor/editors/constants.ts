import {Node} from "slate";
import {ELEMENT_PARAGRAPH} from "@udecode/slate-plugins";
import moment from "moment";
import {TITLE} from "../types";

export const EMPTY_PARAGRAPH_NODE: () => Node = () =>  { return { type: ELEMENT_PARAGRAPH, children: [{ text: ''}], id: getNodeId()} }
export const getNodeId: () => number = () => moment().valueOf()
// @ts-ignore
export const EMPTY_BODY_WITH_TITLE: Node[] = [{ type: TITLE, children: [{ text: ''}] }, EMPTY_PARAGRAPH_NODE()]
