import {ReactEditor} from "slate-react";
import {Editor, Node, NodeEntry, Transforms} from "slate";
import {isEqual} from "lodash";
import {PEAK_LEARNING} from "../plugins/peak-learning-plugin/defaults";
import {ELEMENT_CODE_BLOCK} from "@udecode/slate-plugins";
import {setEditorFocusToNode} from "../../../redux/wikiPageSlice";
import {store, persistor} from "../../../redux/store";

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

export function reEnterDown(editor: ReactEditor, pageId: string, matchFunc: (node: Node) => boolean) {
    const [match] = Editor.nodes(editor, { match: matchFunc, at:[] });
    if (!match) { return }

    const [currNode, currNodePath] = match
    console.log(`RE-ENTERING DOWN`)
    console.log(currNode)
    if (isAtLastLineOfLearning(editor, match)) {
        const [currParent, currParentPath] = Editor.parent(editor, currNodePath)
        console.log(`WE LAST LINE OF LEARNING`)
        console.log(currParent)
        store.dispatch(setEditorFocusToNode({ pageId: pageId, nodeId: currParent.id as string, focused: true}))
        return
    }

    const pathToCodeEditor = ReactEditor.findPath(editor, currNode)

    // Get previous Node and its parent
    const [nextNode, nextNodePath] = Editor.next(editor, {
        at: pathToCodeEditor,
        match: n => Editor.isBlock(editor, n),
        voids: true
    })
    console.log(`NEXT NODE`)
    console.log(nextNode)

    if (nextNode.type === ELEMENT_CODE_BLOCK) {
        store.dispatch(setEditorFocusToNode({ pageId: pageId, nodeId: nextNode.code_id as string, focused: true}))
    } else {
        Transforms.select(editor, nextNodePath)
        Transforms.collapse(editor, {edge: 'end'} )
        ReactEditor.focus(editor)
    }

}
export function reEnterUp(editor: ReactEditor, pageId: string, matchFunc: (node: Node) => boolean) {
    const [match] = Editor.nodes(editor, { match: matchFunc, at:[] });
    console.log(`Re-Enter Up`)
    console.log(match)
    if (!match) { return }
    console.log(`Curr Node`)
    const [currNode, currNodePath] = match
    const [currParent, currParentPath] = Editor.parent(editor, currNodePath)

    const pathToCodeEditor = ReactEditor.findPath(editor, currNode)

    // Get previous Node and its parent
    const [previousNode, previousNodePath] = Editor.previous(editor, {
        at: pathToCodeEditor,
        match: n => Editor.isBlock(editor, n),
        voids: true
    })
    const [previousParent, previousParentPath] = Editor.parent(editor, previousNodePath)

    console.log(`SUCK`)
    console.log(currNode)
    console.log(currParent)

    if (previousParent && currParent && previousParent.type === PEAK_LEARNING && currParent.type !== PEAK_LEARNING) {
        store.dispatch(setEditorFocusToNode({ pageId: pageId, nodeId: previousParent.id as string, focused: true}))
    } else if (previousNode.type === ELEMENT_CODE_BLOCK) {
        store.dispatch(setEditorFocusToNode({ pageId: pageId, nodeId: previousNode.code_id as string, focused: true}))
    } else {
        console.log(`JUST FOCUSING`)
        console.log(previousParent)
        console.log(previousNodePath)
        Transforms.select(editor, previousNodePath)
        Transforms.collapse(editor, {edge: 'end'} )
        ReactEditor.focus(editor)
    }

}

// Random utils we need
export function isAtLastLineOfLearning(editor: Editor, nodeEntry?: any): boolean {
    const [currNode, currPath] = (nodeEntry) ? nodeEntry : Editor.above(editor)
    const [currParent, currParentPath] = Editor.parent(editor, currPath)
    const [lastChildNode] = currParent.children.slice(-1)
    return currParent.type === PEAK_LEARNING && lastChildNode.id === currNode.id
}
export function isCustomPeakVoidElement(node: Node): boolean {
    return [PEAK_LEARNING, ELEMENT_CODE_BLOCK].includes(node.type as string)
}