import {Editor, Node, Range, Transforms} from "slate";
import {ELEMENT_CODE_BLOCK, ELEMENT_LI, ELEMENT_PARAGRAPH, isSelectionAtBlockStart} from "@udecode/slate-plugins";
import {store} from "../../../../redux/store";
import {setEditorFocusToNode} from "../../../../redux/slices/activeEditor/activeEditorSlice";
import {insertCustomBlockElement, next, previous} from "../../utils/base-utils";
import {ReactEditor} from "slate-react";
import {forceFocusToNode} from "../../utils/external-editor-utils";
import {EMPTY_PARAGRAPH_NODE} from "../../editors/constants";

export const createAndFocusCodeBlock = (editor: Editor) => {
    const nodeId = Date.now()
    console.log(`CREATING A CODE BLOCK`)

    // DOESN'T WORK in first line of JOURNAL due to normalization error
    // Transforms.removeNodes(editor)
    Transforms.insertNodes(editor, [
        {
            type: ELEMENT_CODE_BLOCK,
            id: nodeId,
            children: [{text: ''}]
        },
        EMPTY_PARAGRAPH_NODE()
    ]);
    const pageId = window.location.href.split("/").pop()
    store.dispatch(setEditorFocusToNode({pageId: pageId!, nodeId: nodeId, focused: true}))
}

export const peakCodeEditorOnKeyDownHandler = (event: any, editor: Editor) => {
    const currentPath = editor.selection?.anchor.path
    const isCollapsed = editor.selection && Range.isCollapsed(editor.selection)
    const worthEvaluating: boolean = currentPath && isCollapsed && !event.metaKey

    if (worthEvaluating && event.key == "ArrowDown") {
        const nextNode: Node | undefined = next(editor as ReactEditor)

        if (nextNode && nextNode.type === ELEMENT_CODE_BLOCK) {
            event.preventDefault()
            forceFocusToNode(nextNode)
        }
    }

    if (worthEvaluating && (event.key == "ArrowUp")) {
        // The 'Parent' is the current Node, because the current Node is just a leaf, because Slate.....
        const [currNode, currPath] = Editor.above(editor)
        const [currParent, currParentPath] = Editor.parent(editor, currPath)

        // getPreviousNode(editor, currentLevel, editorLevel)
        let previousNode: Node | undefined = previous(editor as ReactEditor)

        if ((currParent && currParent.type !== ELEMENT_LI) && previousNode && isCodeBlockNode(previousNode)) {
            forceFocusToNode(previousNode)
        }
    }

    if (worthEvaluating && event.key == "Backspace") {
        let previousNode: Node | undefined = previous(editor as ReactEditor)
        if (!previousNode) {
            return
        }

        const selectionCollapsedAndAtStart: boolean = isSelectionAtBlockStart(editor) && Range.isCollapsed(editor.selection!)
        if (isCodeBlockNode(previousNode) && (selectionCollapsedAndAtStart)) {
            event.preventDefault()
            forceFocusToNode(previousNode)
        }
    }
}

function isCodeBlockNode(n: Node): boolean {
    return n.type === ELEMENT_CODE_BLOCK
}
