import {ReactEditor} from "slate-react";
import {Editor, Node, Transforms} from "slate";
import {isEqual} from "lodash";
import {PEAK_LEARNING} from "../plugins/peak-learning-plugin/defaults";
import {ELEMENT_CODE_BLOCK, ELEMENT_PARAGRAPH, unwrapList} from "@udecode/slate-plugins";
import {ELEMENT_PEAK_BOOK} from "../plugins/book-plugin/defaults";

export function previous(editor: ReactEditor): Node | undefined {
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

        previousNode = (prevParent && (prevParent.type === PEAK_LEARNING && currParent.type !== PEAK_LEARNING)) ? prevParent : prev
    }
    return previousNode
}
export function next(editor: ReactEditor): Node | undefined {
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

export function insertCustomBlockElement(editor: Editor, nodeType: string) {
    unwrapList(editor);

    // Transforms.removeNodes(editor)
    Transforms.insertNodes(editor, [
        {
            type: nodeType,
            children: [{children: [{text: ''}], type: ELEMENT_PARAGRAPH}]
        },
        {
            type: ELEMENT_PARAGRAPH,
            children: [{text: ''}]
        }
    ]);
}

export function isPeakKnowledgeNoteType(n: Node): boolean {
    return [PEAK_LEARNING, ELEMENT_PEAK_BOOK].includes(n.type as string)
}

export function isCustomPeakVoidElement(node: Node): boolean {
    return [ELEMENT_CODE_BLOCK, PEAK_LEARNING, ELEMENT_PEAK_BOOK].includes(node.type as string)
}
