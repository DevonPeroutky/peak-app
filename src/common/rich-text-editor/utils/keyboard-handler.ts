import {
    ELEMENT_CODE_BLOCK,
    ELEMENT_LINK,
    ELEMENT_OL,
    ELEMENT_UL,
    isSelectionAtBlockStart,
    toggleList
} from "@udecode/slate-plugins";
import {Editor, Node, Range} from "slate";
import {
    closeLinkMenu,
    openEditLinkMenu,
    openEmptyLinkMenu,
    PeakHyperlinkState,
    setEditorFocusToNode
} from "../../../redux/wikiPageSlice";
import {ReactEditor} from "slate-react";
import {Dispatch} from "redux";
import {PEAK_LEARNING} from "../plugins/peak-learning-plugin/defaults";
import {
    isAtLastLineOfLearning,
    isCustomPeakVoidElement,
    next,
    previous
} from "./editor-utils";

export const baseKeyBindingHandler = (event: any, editor: ReactEditor, dispatch: Dispatch, currentPageId: string, editorLevel: number = 1) => {
    if (event.shiftKey && event.key == '8') {
        toggleList(editor, { typeList: ELEMENT_UL })
    }

    if (event.shiftKey && event.key == '9') {
        toggleList(editor, { typeList: ELEMENT_OL })
    }

    if (event.metaKey && event.key == 'l') {
        event.preventDefault();
        const [...match] = Editor.nodes(editor, { match: n => n.type === "a" });

        /**
         * - This is an existing Link
         * - Need to get current node --> if link --> populate
         */
        if (match.length > 0) {
            const theNode = match[0]
            const linkNode: Node = theNode[0]
            const text: string = Node.string(linkNode)
            const url: string = linkNode.url as string
            const linkId: string = linkNode.id as string
            const linkSelection: Range = linkNode.selection_range as Range
            const currentHyperlink: PeakHyperlinkState = {
                currentHyperLinkId: linkId,
                currentLinkUrl: url,
                currentText: text,
                currentSelection: linkSelection
            };
            dispatch(openEditLinkMenu({ pageId: currentPageId, hyperlinkState: currentHyperlink} ));
        } else {
            dispatch(openEmptyLinkMenu(currentPageId));
        }
    }

    if (event.key === 'Escape') {
        dispatch(closeLinkMenu(currentPageId));
    }

    /**
     * Handle the following usecases:
     * 1. Going into a PeakCodeEditor
     * 2. Going into a PeakLearningTagSelect
     * 3. Going into a PeakCodeEditor within a PeakLearningTagSelect
     *
     * Without throwing errors when at the bottom
     */
    if (!event.metaKey && event.key == "ArrowDown") {
        const nextNode: Node | undefined = next(editor)

        const [currNode, currPath] = Editor.above(editor)
        const [currParent, currParentPath] = Editor.parent(editor, currPath)
        console.log(`NEXT NODE`)
        console.log(nextNode)

        if (isAtLastLineOfLearning(editor)) {
            console.log(`Go to LearningSelect`)
            dispatch(setEditorFocusToNode({ pageId: currentPageId, nodeId: currParent.id as string, focused: true}))
        } else if (nextNode && nextNode.type === ELEMENT_CODE_BLOCK) {
            event.preventDefault()
            dispatch(setEditorFocusToNode({ pageId: currentPageId, nodeId: nextNode.code_id as string, focused: true}))
        }
    }

    /**
     * Handle the following usecases:
     * 1. Going into a PeakCodeEditor
     * 2. Going into a PeakLearningTagSelect
     * 3. Going into a PeakCodeEditor within a PeakLearningTagSelect
     *
     * Without throwing errors when at the Top
     */
    if (!event.metaKey && (event.key == "ArrowUp")) {

        // getPreviousNode(editor, currentLevel, editorLevel)
        let previousNode: Node | undefined = previous(editor)
        console.log(`Previous Node`)
        console.log(previousNode)
        if (previousNode && isCustomPeakVoidElement(previousNode)) {
            // TODO: Replace this when we get rid of code_id
            const id: string = previousNode.type === PEAK_LEARNING ? previousNode.id as string : previousNode.code_id as string
            dispatch(setEditorFocusToNode({ pageId: currentPageId, nodeId: id, focused: true}))
        }
    }

    /**
     * Handle the following usecases:
     * 1. Going into a PeakCodeEditor
     * 2. Going into a PeakLearningTagSelect
     *
     * Without throwing errors when at the Top
     */
    if (!event.metaKey && event.key == "Backspace") {
        let previousNode: Node | undefined = previous(editor)
        if (!previousNode) {
            return
        }

        const selectionCollapsedAndAtStart: boolean = isSelectionAtBlockStart(editor) && Range.isCollapsed(editor.selection!)
        const isPreviousBlockVoid: boolean = [PEAK_LEARNING, ELEMENT_CODE_BLOCK].includes(previousNode.type as string)
        if (isPreviousBlockVoid && (selectionCollapsedAndAtStart)) {
            const id: string = previousNode.type === PEAK_LEARNING ? previousNode.id as string : previousNode.code_id as string
            dispatch(setEditorFocusToNode({ pageId: currentPageId, nodeId: id, focused: true}))
        }
    }
}
