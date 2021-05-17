import {ReactEditor} from "slate-react";
import {Editor, Node, Point, Range, Transforms} from "slate";
import {isEqual} from "lodash";
import {ELEMENT_PARAGRAPH, someNode, SPEditor} from "@udecode/slate-plugins";
import {isPeakKnowledgeNoteType} from "../plugins/peak-knowledge-plugin/utils";
import {EMPTY_PARAGRAPH_NODE} from "../editors/constants";
import {UghEditorType} from "../types";

export function previous(editor: UghEditorType): Node | undefined {
    const currentPath = editor.selection?.anchor.path
    let previousNode: Node = undefined

    const [firstNode] = Editor.first(editor, [])
    const firstPath = ReactEditor.findPath(editor, firstNode)
    if (firstPath && currentPath && !isEqual(firstPath, currentPath)) {

        // The 'Parent' is the current Node, because the current Node is just a leaf, because Slate.....
        const currNode = Node.parent(editor, currentPath)

        // Get previous Node and its parent
        const [prev, prevPath] = Editor.previous(editor, {
            at: currNode[1] as number[],
            match: n => Editor.isBlock(editor, n),
            voids: true
        })
        const prevParent = Node.parent(editor, prevPath)

        // Refetch the node for Slate's bitchass
        // TODO!!!!! Error: Cannot get the parent path of the root path [].
        const [curr, currPath] = Editor.above(editor)
        const currParent = Node.parent(editor, currPath)

        previousNode = (prevParent && (isPeakKnowledgeNoteType(prevParent) && !isPeakKnowledgeNoteType(currParent))) ? prevParent : prev
    }
    return previousNode
}
export function next(editor: UghEditorType): Node | undefined {
    const currentPath = editor.selection?.anchor.path

    const [lastNode] = Editor.last(editor, [])
    const lastPath = ReactEditor.findPath(editor, lastNode)
    if (lastPath && currentPath && !isEqual(lastPath, currentPath)) {
        const currNode = Node.parent(editor, currentPath)

        // Get previous Node and its parent
        const [nextNode, nextNodePath] = Editor.next(editor, {
            at: currNode[1] as number[],
            match: n => Editor.isBlock(editor, n),
            voids: true
        })

        return nextNode
    }
    return undefined
}

export function insertCustomBlockElement(editor: Editor, nodeType: string, nodeProps?: {}) {
    const nodeId = Date.now()
    Transforms.insertNodes(editor, [
        {
            id: nodeId,
            type: nodeType,
            // @ts-ignore
            children: [{children: [{text: ''}], type: ELEMENT_PARAGRAPH }],
            ...nodeProps,
        },
        EMPTY_PARAGRAPH_NODE()
    ]);
}
export function insertCustomBlockElementCallback(nodeType: string, nodeProps?: {}): (editor: Editor) => void {
    return (editor: Editor) => insertCustomBlockElement(editor, nodeType, nodeProps)
}

export function isAtTopLevelOfEditor(selection: Range, editorLevel: number) {
    const isPointAtTopLevel= (p: Point) => {
        return p && p.path && p.path.length === editorLevel + 1
    }

    return isPointAtTopLevel(selection.focus) && isPointAtTopLevel(selection.anchor)
}

export function isNodeTypeIn(editor: Editor, format: string): boolean {
    return someNode(editor, { match: { type: format } })
}