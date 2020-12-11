import {ReactEditor} from "slate-react";
import {Editor, Node, Transforms} from "slate";
import {isAtLastLineOfLearning} from "../plugins/peak-learning-plugin/utils";
import {store} from "../../../redux/store";
import {setEditorFocusToNode} from "../../../redux/wikiPageSlice";
import {ELEMENT_CODE_BLOCK} from "@udecode/slate-plugins";
import {PEAK_LEARNING} from "../plugins/peak-learning-plugin/defaults";
import {getCurrentPageId} from "../../../utils/links";

// TODO: This shouldn't require last line of learning knowledge
export function reEnterDown(editor: ReactEditor, matchFunc: (node: Node) => boolean) {
    const [match] = Editor.nodes(editor, { match: matchFunc, at:[] });
    if (!match) { return }

    const [currNode, currNodePath] = match
    console.log(`RE-ENTERING DOWN`)
    console.log(currNode)
    if (isAtLastLineOfLearning(editor, match)) {
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

    if (nextNode.type === ELEMENT_CODE_BLOCK) {
        forceFocusToNode(nextNode)
    } else {
        Transforms.select(editor, nextNodePath)
        Transforms.collapse(editor, {edge: 'end'} )
        ReactEditor.focus(editor)
    }

}
export function reEnterUp(editor: ReactEditor, matchFunc: (node: Node) => boolean) {
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

    if (previousParent && currParent && previousParent.type === PEAK_LEARNING && currParent.type !== PEAK_LEARNING) {
        Transforms.select(editor, previousParentPath)
        Transforms.collapse(editor, { edge: "end"})
        ReactEditor.focus(editor)
    } else if (previousNode.type === ELEMENT_CODE_BLOCK) {
        forceFocusToNode(previousNode)
    } else {
        Transforms.select(editor, previousNodePath)
        Transforms.collapse(editor, {edge: 'end'} )
        ReactEditor.focus(editor)
    }

}

export function forceFocusToNode(slateNode: Node, focus: boolean = true) {
    const currentPageId = getCurrentPageId()
    if (currentPageId) {
        store.dispatch(setEditorFocusToNode({ pageId: currentPageId, nodeId: slateNode.id as number, focused: focus}))
    }
}