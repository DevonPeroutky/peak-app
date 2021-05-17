import {Node} from "slate";
import {capitalize, cloneDeep, isObject, keyBy, transform} from "lodash";
import {PeakDisplayNode, PeakNode, PeakNodeType, PeakStructureNode, PeakTopicNode} from "../redux/slices/user/types";
import {useSelector} from "react-redux";
import {AppState} from "../redux";
import {
    ELEMENT_H1,
    ELEMENT_H2,
    ELEMENT_H3,
    ELEMENT_H4,
    ELEMENT_H5,
    ELEMENT_H6,
    KEYS_HEADING
} from "@udecode/slate-plugins";
import {PeakNote} from "../redux/slices/noteSlice";
import {buildNoteUrl} from "./notes";
import {
    ELEMENT_PEAK_BOOK,
    ELEMENT_WEB_NOTE,
    PEAK_LEARNING
} from "../common/rich-text-editor/plugins/peak-knowledge-plugin/constants";
import {deriveHostname} from "./urls";
import {sort} from "ramda";
import { ELEMENT_TITLE } from "component-library";

const orderByUpdated = (a: PeakDisplayNode, b: PeakDisplayNode) => {
    return (a.updated_at <= b.updated_at) ? 1 : -1
};
const priority = (node: PeakStructureNode) => {
    const HIERARCHY_PRIORITIES: string[] = [ELEMENT_TITLE, ELEMENT_H1, ELEMENT_H2, ELEMENT_H3, ELEMENT_H4, ELEMENT_H5, ELEMENT_H6].map(x => x as string)
    return (node.header_type === ELEMENT_TITLE) ? 0 : HIERARCHY_PRIORITIES.indexOf(node.header_type as string)
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

const covertSlateNodeToPeakNode: (node: Node, topicId: string, pageId: string, updatedAt: number) => PeakStructureNode = (node, topicId, pageId, updatedAt) => {
    // @ts-ignore
    const children: Node[] = node.children as Node[]
    // @ts-ignore
    const text: string = children[0].text as string
    // @ts-ignore
    const header_id: PeakNodeType = node.header_id as PeakNodeType
    const url = (header_id) ? `/topic/${topicId}/wiki/${pageId}#${header_id}` : `/topic/${topicId}/wiki/${pageId}`
    // @ts-ignore
    const nodeType = node.type as string

    return {
        parent: null,
        children: [],
        header_type: (nodeType === ELEMENT_TITLE) ? ELEMENT_TITLE : nodeType,
        header_id: header_id,
        title: (text === "") ? "Untitled Page" : text,
        topic_id: topicId,
        page_id: pageId,
        updated_at: updatedAt
    }
}
function buildDisplayNode(node: PeakStructureNode, path: string): PeakDisplayNode {
    const headerString = (node.header_id) ? `#${node.header_id}` : ""
    return {
        url: `/topic/${node.topic_id}/wiki/${node.page_id}${headerString}`,
        page_id: node.page_id,
        header_id: node.header_id,
        topic_id: node.topic_id,
        path: path,
        updated_at: node.updated_at,
        header_type: node.header_type,
        title: node.title
    }
}

const derivePageStructure = (pageBody: Node[], topicId: string, pageId: string, updatedAt: number) => {

    let currentParent: PeakStructureNode | null = null
    const nodes: Node[] = pageBody//[0].children as Node[]
    // @ts-ignore
    const headers: Node[] = nodes.filter(n => KEYS_HEADING.includes(n.type as string) || n.type === ELEMENT_TITLE )
    const titleNode = covertSlateNodeToPeakNode(headers.shift() as Node, topicId, pageId, updatedAt)

    headers.forEach(currNode => {
        const currPeakNode: PeakStructureNode = covertSlateNodeToPeakNode(currNode, topicId, pageId, updatedAt)
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

    console.log(`PAGE NODE: `, titleNode)

    return deepOmit(titleNode, "parent")
}

// --------------------------------------------
// Exported Functions
// --------------------------------------------
export function convertHierarchyToSearchableList(hierarchy: PeakTopicNode[], notes: PeakNote[]): PeakDisplayNode[] {

    const choosePath = (note: PeakNote) => {
        switch (note.note_type) {
            case PEAK_LEARNING:
                return "My Note"
            case ELEMENT_PEAK_BOOK:
                return capitalize(note.author)
            case ELEMENT_WEB_NOTE:
                return deriveHostname(note.url)
        }
    }
    const scratchPadNode: PeakDisplayNode = {
        title: "Scratchpad",
        url: "/home/scratchpad",
        header_type: "scratchpad"
    }

    const noteNodes: PeakDisplayNode[] = notes.map(n => ({
        title: n.title,
        url: buildNoteUrl(n.id),
        icon_url: n.icon_url,
        updated_at: Date.parse(n.updated_at), // This is broken
        path: choosePath(n),
        header_type: n.note_type,
    }))
    function addNodes(node: PeakStructureNode, path: string, theList: PeakDisplayNode[]): void {
        if (!(KEYS_HEADING.includes(node.header_type) && !node.header_id)) {
            theList.push(buildDisplayNode(node, path))
        }
        node.children.map((peakNode) => {
            addNodes(peakNode, `${path} > ${capitalize(node.title)}`, theList)
        })
    }

    const theList: PeakDisplayNode[] = []
    // TODO: FLATMAP????
    hierarchy.forEach((topicNode) => {
        let parentPath = capitalize(topicNode.title)

        topicNode.children.forEach((peakNode) => {
            addNodes(peakNode, parentPath, theList)
        })
    })

    return [scratchPadNode, ...sort(orderByUpdated, [...theList, ...noteNodes])]
}

export const useUpdatePageInHierarchy = () => {
    const currentHierarchy = useSelector<AppState, PeakTopicNode[]>(state => state.currentUser.hierarchy);
    const usableHierarchy: PeakTopicNode[] = cloneDeep(currentHierarchy)

    return (newBody: Node[], topicId: string, pageId: string) => {
        console.log(`CALCULATING THE HIERARCHY`)
        const topicHierarchy = usableHierarchy.find(t => t.topic_id === topicId)!
        const newPageStructure: PeakStructureNode = derivePageStructure(newBody, topicHierarchy.topic_id, pageId, Date.now())
        const updatedTopicHierarchy: PeakTopicNode = {...topicHierarchy, children: [...topicHierarchy.children.filter(pageNode => pageNode.page_id !== pageId), newPageStructure]}

        // Replace page in topic hierarchy
        return [...usableHierarchy.filter(t => t.topic_id !== topicId), updatedTopicHierarchy]
    }
}
