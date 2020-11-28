import {ReactEditor} from "slate-react";
import {Editor, Node, NodeEntry, Transforms} from "slate";
import {isEqual} from "lodash";
import {PEAK_LEARNING} from "../plugins/peak-learning-plugin/defaults";
import {ELEMENT_CODE_BLOCK} from "@udecode/slate-plugins";
import {setEditorFocusToNode} from "../../../redux/wikiPageSlice";
import {Dispatch} from "redux";

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

export function reEnterDown(dispatch: Dispatch, editor: ReactEditor, pageId: string, match: NodeEntry<Node>) {
    const [currNode, currNodePath] = match
    if (isAtLastLineOfLearning(editor, match)) {
        const [currParent, currParentPath] = Editor.parent(editor, currNodePath)
        dispatch(setEditorFocusToNode({ pageId: pageId, nodeId: currParent.id as string, focused: true}))
        return
    }

    const pathToCodeEditor = ReactEditor.findPath(editor, match[0])

    // Get previous Node and its parent
    const [nextNode, nextNodePath] = Editor.next(editor, {
        at: pathToCodeEditor,
        match: n => Editor.isBlock(editor, n),
        voids: true
    })

    if (nextNode.type === ELEMENT_CODE_BLOCK) {
        dispatch(setEditorFocusToNode({ pageId: pageId, nodeId: nextNode.code_id as string, focused: true}))
    } else {
        Transforms.select(editor, nextNodePath)
        Transforms.collapse(editor, {edge: 'end'} )
        ReactEditor.focus(editor)
    }

}
export function useReEnterUp(dispatch: Dispatch, editor: ReactEditor, pageId: string, match: NodeEntry<Node>) {
    const [currNode, currNodePath] = match

    const pathToCodeEditor = ReactEditor.findPath(editor, currNode)

    // Get previous Node and its parent
    const [previousNode, previousNodePath] = Editor.previous(editor, {
        at: pathToCodeEditor,
        match: n => Editor.isBlock(editor, n),
        voids: true
    })
    const [previousParent, previousParentPath] = Editor.parent(editor, previousNodePath)
    console.log(`Previous Parent`)
    console.log(previousParent)


    if (previousParent && previousParent.type === PEAK_LEARNING) {
        dispatch(setEditorFocusToNode({ pageId: pageId, nodeId: previousParent.id as string, focused: true}))
    } else if (previousNode.type === ELEMENT_CODE_BLOCK) {
        dispatch(setEditorFocusToNode({ pageId: pageId, nodeId: previousNode.code_id as string, focused: true}))
    } else {
        Transforms.select(editor, previousNodePath)
        Transforms.collapse(editor, {edge: 'end'} )
        ReactEditor.focus(editor)
    }

}

// Random utils we need
export function isAtLastLineOfLearning(editor: Editor, nodeEntry?: any): boolean {
    const [currNode, currPath] = (nodeEntry) ? nodeEntry : Editor.above(editor)
    console.log(`Current Node`)
    console.log(currNode)
    const [currParent, currParentPath] = Editor.parent(editor, currPath)
    const [lastChildNode] = currParent.children.slice(-1)
    return currParent.type === PEAK_LEARNING && lastChildNode.id === currNode.id
}
export function isCustomPeakVoidElement(node: Node): boolean {
    return [PEAK_LEARNING, ELEMENT_CODE_BLOCK].includes(node.type as string)
}