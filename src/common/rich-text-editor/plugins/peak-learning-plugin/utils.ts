import {Editor, Node, Range, Transforms} from "slate";
import {
    ELEMENT_LI,
    ELEMENT_PARAGRAPH,
    isSelectionAtBlockStart,
    unwrapList
} from "@udecode/slate-plugins";
import {PEAK_LEARNING} from "./defaults";
import {TAG_COLORS} from "./constants";
import {PeakDisplayTag} from "./component/PeakLearning";
import {ReactEditor} from "slate-react";
import {previous} from "../../utils/base-utils";
import {forceFocusToNode} from "../../utils/external-editor-utils";

export const createLearning = (editor: Editor) => {
    unwrapList(editor);
    // Transforms.removeNodes(editor)
    Transforms.insertNodes(editor, [
        {
            type: PEAK_LEARNING,
            children: [{children: [{text: ''}], type: ELEMENT_PARAGRAPH}]
        },
        {
            type: ELEMENT_PARAGRAPH,
            children: [{text: ' '}]
        }
    ]);
}

export const calculateNextColor = (tags: PeakDisplayTag[]) => {
    if ( tags.length === 0 ) return TAG_COLORS[0]

    const currColorIndex = TAG_COLORS.indexOf(tags[0].color)
    return (currColorIndex === TAG_COLORS.length - 1) ? TAG_COLORS[0] : TAG_COLORS[currColorIndex + 1]
}

// TDOD: THIS DOES NOT WORK WITH LISTS.
export function isAtLastLineOfLearning(editor: Editor, nodeEntry?: any): boolean {
    const [currNode, currPath] = (nodeEntry) ? nodeEntry : Editor.above(editor)
    const [currParent, currParentPath] = Editor.parent(editor, currPath)
    const [lastChildNode] = currParent.children.slice(-1)
    return currParent.type === PEAK_LEARNING && lastChildNode.id === currNode.id
}

function isPeakLearningType(n: Node): boolean {
    return n.type === PEAK_LEARNING
}

export const learningOnKeyDownHandler = (event: any, editor: Editor) => {
    const currentPath = editor.selection?.anchor.path
    if (currentPath === undefined)  { return }
    const reactEditor: ReactEditor = editor as ReactEditor
    if (currentPath && !event.metaKey && event.key == "ArrowDown") {

        const [currNode, currPath] = Editor.above(editor)
        const [currParent, currParentPath] = Editor.parent(editor, currPath)

        if (isAtLastLineOfLearning(editor)) {
            event.preventDefault();
            forceFocusToNode(currParent)
        }
    }

    if (currentPath && !event.metaKey && (event.key == "ArrowUp")) {
        const [currNode, currPath] = Editor.above(editor)
        const [currParent, currParentPath] = Editor.parent(editor, currPath)

        const previousNode: Node | undefined = previous(reactEditor)
        if ((currParent && currParent.type !== ELEMENT_LI) && previousNode && isPeakLearningType(previousNode)) {
            event.preventDefault();
            const previousNodePath: number[] = ReactEditor.findPath(reactEditor, previousNode)
            Transforms.select(editor, previousNodePath)
            Transforms.collapse(editor, { edge: 'end' });
        }
    }

    if (currentPath && !event.metaKey && event.key == "Backspace") {
        let previousNode: Node | undefined = previous(editor as ReactEditor)
        if (!previousNode) {
            return
        }

        const selectionCollapsedAndAtStart: boolean = isSelectionAtBlockStart(editor) && Range.isCollapsed(editor.selection!)
        if (isPeakLearningType(previousNode) && (selectionCollapsedAndAtStart)) {
            forceFocusToNode(previousNode)
        }
    }
}

