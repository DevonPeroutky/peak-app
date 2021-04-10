import {ReactEditor} from "slate-react";
import {Editor, Node, Transforms} from "slate";
import {store} from "../../../redux/store";
import {setEditorFocusToNode} from "../../../redux/slices/activeEditor/activeEditorSlice";
import {
    isAtLastLineOfPeakKnowledgeNode,
    isPeakKnowledgeNoteType
} from "../plugins/peak-knowledge-plugin/utils";
import {ELEMENT_CODE_BLOCK} from "@udecode/slate-plugins";
import {UghEditorType} from "../types";

export function isNodeTypeExternalEditor(n: Node) {
    return [ELEMENT_CODE_BLOCK].includes(n.type as string)
}

// TODO: This shouldn't require last line of learning knowledge
export function reEnterDown(editor: UghEditorType, matchFunc: (node: Node) => boolean) {
    const [match] = Editor.nodes(editor, { match: matchFunc, at:[] });
    if (!match) { return }

    const [currNode, currNodePath] = match
    console.log(`RE-ENTERING DOWN`)
    console.log(currNode)
    if (isAtLastLineOfPeakKnowledgeNode(editor, match)) {
        const [currParent, currParentPath] = Editor.parent(editor, currNodePath)
        console.log(`WE LAST LINE OF LEARNING`)
        console.log(currParent)
        forceFocusToNode(currParent)
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

    if (isNodeTypeExternalEditor(nextNode)) {
        forceFocusToNode(nextNode)
    } else {
        Transforms.select(editor, nextNodePath)
        Transforms.collapse(editor, {edge: 'end'} )
        ReactEditor.focus(editor)
    }

}
export function reEnterUp(editor: UghEditorType, matchFunc: (node: Node) => boolean) {
    const [match] = Editor.nodes(editor, { match: matchFunc, at:[] });
    if (!match) { return }

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

    if (previousParent && currParent && isPeakKnowledgeNoteType(previousParent) && !isPeakKnowledgeNoteType(currParent)) {
        Transforms.select(editor, previousParentPath)
        Transforms.collapse(editor, { edge: "end"})
        ReactEditor.focus(editor)
    } else if (isNodeTypeExternalEditor(previousNode)) {
        forceFocusToNode(previousNode)
    } else {
        Transforms.select(editor, previousNodePath)
        Transforms.collapse(editor, {edge: 'end'} )
        ReactEditor.focus(editor)
    }
}

export function forceFocusToNode(slateNode: Node, focus: boolean = true) {
    console.log(`FORCING FOCUS TO: `, slateNode,focus)
    store.dispatch(setEditorFocusToNode({ nodeId: slateNode.id as number, focused: focus}))
}