import {Editor, Node, Range, Transforms} from "slate";
import {isPeakKnowledgeNoteType, previous} from "./base-utils";
import {ReactEditor} from "slate-react";
import {forceFocusToNode} from "./external-editor-utils";
import {ELEMENT_LI, isSelectionAtBlockStart} from "@udecode/slate-plugins";

// TODO MOVE ALL OF THIS TO KNOWLEDGE-PLUGIN!

// TDOD: THIS DOES NOT WORK WITH LISTS.
export function isAtLastLineOfPeakKnowledgeNode(editor: Editor, nodeEntry?: any): boolean {
    const [currNode, currPath] = (nodeEntry) ? nodeEntry : Editor.above(editor)
    const [currParent, currParentPath] = Editor.parent(editor, currPath)
    const [lastChildNode] = currParent.children.slice(-1)
    return isPeakKnowledgeNoteType(currParent) && lastChildNode.id === currNode.id
}

export const knowledgeNodeOnKeyDownHandler = (event: any, editor: Editor) => {
    const currentPath = editor.selection?.anchor.path
    const reactEditor: ReactEditor = editor as ReactEditor

    const isCollapsed = Range.isCollapsed(editor.selection)
    const worthEvaluating: boolean = currentPath && isCollapsed && !event.metaKey

    if (worthEvaluating && event.key == "ArrowDown") {
        const [currNode, currPath] = Editor.above(editor)
        const [currParent, currParentPath] = Editor.parent(editor, currPath)

        if (isAtLastLineOfPeakKnowledgeNode(editor)) {
            event.preventDefault();
            forceFocusToNode(currParent)
        }
    }
    if (worthEvaluating && event.key == "ArrowUp") {
        const [currNode, currPath] = Editor.above(editor)
        const [currParent, currParentPath] = Editor.parent(editor, currPath)

        console.log(`GOING DOWN`)

        const previousNode: Node | undefined = previous(reactEditor)
        if ((currParent && currParent.type !== ELEMENT_LI) && previousNode && isPeakKnowledgeNoteType(previousNode)) {
            event.preventDefault();
            const previousNodePath: number[] = ReactEditor.findPath(reactEditor, previousNode)
            Transforms.select(editor, previousNodePath)
            Transforms.collapse(editor, { edge: 'end' });
        }
    }
}
