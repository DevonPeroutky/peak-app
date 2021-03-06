import { Node } from "slate";
import { keyBy, transform, isObject} from "lodash";
import {PeakDisplayNode, PeakNode, PeakNodeType, PeakStructureNode, PeakTopicNode} from "../redux/slices/user/types";
import { useSelector} from "react-redux";
import { AppState} from "../redux";
import { cloneDeep} from "lodash";
import { TreeNodeNormal} from "antd/es/tree/Tree";
import { capitalize } from "lodash";
import { ELEMENT_H1, ELEMENT_H2, ELEMENT_H3, ELEMENT_H4, ELEMENT_H5, ELEMENT_H6 } from "@udecode/slate-plugins";
import {HEADER_TYPES, TITLE} from "../common/rich-text-editor/types";
import {PeakNote} from "../redux/slices/noteSlice";
import {buildNoteUrl} from "./notes";
import {ELEMENT_PEAK_BOOK} from "../common/rich-text-editor/plugins/peak-knowledge-plugin/constants";
import {deriveHostname} from "./urls";

const priority = (node: PeakStructureNode) => {
    const HIERARCHY_PRIORITIES: string[] = [TITLE, ELEMENT_H1, ELEMENT_H2, ELEMENT_H3, ELEMENT_H4, ELEMENT_H5, ELEMENT_H6].map(x => x as string)
    return (node.header_type === TITLE) ? 0 : HIERARCHY_PRIORITIES.indexOf(node.header_type as string)
}

const covertNodeToPeakNode: (node: Node, topicId: string, pageId: string) => PeakStructureNode = (node: Node, topicId: string, pageId: string) => {
    const children: Node[] = node.children as Node[]
    const text: string = children[0].text as string
    const header_id: PeakNodeType = node.header_id as PeakNodeType
    const url = (header_id) ? `/topic/${topicId}/wiki/${pageId}#${header_id}` : `/topic/${topicId}/wiki/${pageId}`
    const nodeType = node.type as string

    return {
        parent: null,
        children: [],
        header_type: (nodeType === TITLE) ? TITLE : nodeType,
        header_id: header_id,
        title: (text === "") ? "Untitled Page" : text,
        topic_id: topicId,
        page_id: pageId
    }
}
const deriveStructureForTopic = (pageBody: Node[], topicHierarchy: PeakTopicNode, pageId: string) => {
    const newPageStructure: PeakStructureNode = derivePageStructure(pageBody, topicHierarchy.topic_id, pageId)
    topicHierarchy.children = [...topicHierarchy.children.filter(pageNode => pageNode.page_id !== pageId), newPageStructure]
    return topicHierarchy
}

const derivePageStructure = (pageBody: Node[], topicId: string, pageId: string) => {

    let currentParent: PeakStructureNode | null = null
    const nodes: Node[] = pageBody[0].children as Node[]
    const headers: Node[] = nodes.filter(n => HEADER_TYPES.includes(n.type as string) || n.type === TITLE )
    const titleNode = covertNodeToPeakNode(headers.shift() as Node, topicId, pageId)

    headers.forEach(currNode => {
        const currPeakNode: PeakStructureNode = covertNodeToPeakNode(currNode, topicId, pageId)
        const p1 = priority(currPeakNode)

        while (currentParent && priority(currentParent) >= p1 ) {
            currentParent = currentParent.parent
        }

        if (currentParent) {
            currPeakNode.parent = currentParent
            currentParent.children.push(currPeakNode)
        } else {
            titleNode.children.push(currPeakNode)
        }
        currentParent = currPeakNode
    })

    return deepOmit(titleNode, "parent")
}

function deepOmit(obj: PeakStructureNode, keysToOmit: string): PeakStructureNode {
    var keysToOmitIndex =  keyBy(Array.isArray(keysToOmit) ? keysToOmit : [keysToOmit] ); // create an index object of the keys that should be omitted

    function omitFromObject(obj: PeakStructureNode) { // the inner function which will be called recursively

        // @ts-ignore
        return transform(obj, function(result: any, value: PeakStructureNode, key: any) { // transform to a new object
            if (key in keysToOmitIndex) { // if the key is in the index skip it
                return;
            }

            result[key] = isObject(value) ? omitFromObject(value) : value; // if the key is an object run it through the inner function - omitFromObject
        })
    }

    // @ts-ignore
    return omitFromObject(obj); // return the inner function result
}

// --------------------------------------------
// Exported Functions
// --------------------------------------------
export function convertHierarchyToSearchableList(hierarchy: PeakTopicNode[], notes: PeakNote[]): PeakDisplayNode[] {
    console.log(`REBUILDING THE HIERARCHY`)
    const journalNode: PeakDisplayNode = {
        title: "Journal",
        url: "/home/journal",
        header_type: "journal"
    }
    const noteNodes: PeakDisplayNode[] = notes.map(n => ({
        title: n.title,
        url: buildNoteUrl(n.id),
        icon_url: n.icon_url,
        path: (n.note_type === ELEMENT_PEAK_BOOK) ? capitalize(n.author) : deriveHostname(n.url),
        header_type: n.note_type,
    }))

    function convertToDisplayNode(node: PeakStructureNode, path: string): PeakDisplayNode {
        const headerString = (node.header_id) ? `#${node.header_id}` : ""
        return {
            url: `/topic/${node.topic_id}/wiki/${node.page_id}${headerString}`,
            page_id: node.page_id,
            header_id: node.header_id,
            topic_id: node.topic_id,
            path: path,
            header_type: node.header_type,
            title: node.title
        }
    }
    function addNodes(node: PeakStructureNode, path: string, theList: PeakDisplayNode[]): void {
        if (!(HEADER_TYPES.includes(node.header_type) && !node.header_id)) {
            theList.push(convertToDisplayNode(node, path))
        }
        node.children.map((peakNode) => {
            addNodes(peakNode, `${path} > ${capitalize(node.title)}`, theList)
        })
    }

    const theList: PeakDisplayNode[] = []

    hierarchy.forEach((topicNode) => {
        let parentPath = capitalize(topicNode.title)

        topicNode.children.forEach((peakNode) => {
            addNodes(peakNode, parentPath, theList)
        })
    })
    return [journalNode, ...noteNodes, ...theList]
}

export function convertPeakNodeToTreeNode(obj: PeakNode): TreeNodeNormal {
    function populateNecessaryFields(obj: PeakNode) {
        const newObj = obj
        // @ts-ignore
        const uniqId = (obj['disabled']) ? obj.topic_id : (obj['header_type'] && obj['header_type'] === "title") ? obj.page_id : obj.header_id

        // @ts-ignore
        newObj['key'] = uniqId ? uniqId : `undefined-${Math.random()}`;

        // @ts-ignore
        newObj['value'] = uniqId
        newObj['title'] = capitalize(obj.title)

        // @ts-ignore
        return transform(newObj, function (result: any, value: PeakNode, key: any) {
            result[key] = isObject(value) ? populateNecessaryFields(value) : value;
        })
    }

    // @ts-ignore
    return populateNecessaryFields(obj)
}

export const useUpdatePageInHierarchy = () => {
    const currentHierarchy = useSelector<AppState, PeakTopicNode[]>(state => state.currentUser.hierarchy);
    const usableHierarchy: PeakTopicNode[] = cloneDeep(currentHierarchy)

    return (newBody: Node[], topicId: string, pageId: string) => {
        console.log(`CALCULATING THE HIERARCHY`)
        const topicHierarchy = usableHierarchy.find(t => t.topic_id === topicId)!
        const updatedTopicHierarchy: PeakTopicNode = deriveStructureForTopic(newBody, topicHierarchy, pageId)

        // Replace page in topic hierarchy
        return [...usableHierarchy.filter(t => t.topic_id !== topicId), updatedTopicHierarchy]
    }
}
