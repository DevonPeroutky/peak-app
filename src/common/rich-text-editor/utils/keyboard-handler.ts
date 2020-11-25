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
import {isEqual} from "lodash";
import {Dispatch} from "redux";
import {PEAK_LEARNING} from "../plugins/peak-learning-plugin/defaults";

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
     *
     * Without throwing errors when at the bottom
     */
    if (!event.metaKey && event.key == "ArrowDown") {
        const nextNode = getNextNodeInTheOnlyGrossWayPossible(editor, editorLevel)
        console.log(`Next Node`)
        console.log(nextNode)

        if (nextNode) {
            const [currNode, currPath] = Editor.above(editor)
            const [currParent, currParentPath] = Editor.parent(editor, currPath)

            if (isAtLastLineOfLearning(editor, editorLevel)) {
                console.log(`AT THE BOTTOM`)
                dispatch(setEditorFocusToNode({ pageId: currentPageId, nodeId: currParent.id as string, focused: true}))
            }

            // WE ARE AT THE BOTTOM OF THE Code
            if (nextNode && nextNode.code_id) {
                event.preventDefault()
                // @ts-ignore
                dispatch(setEditorFocusToNode({ pageId: currentPageId, nodeId: nextNode.code_id, focused: true}))
            }
        }
    }

    /**
     * Handle the following usecases:
     * 1. Going into a PeakCodeEditor
     * 2. Going into a PeakLearningTagSelect
     *
     * Without throwing errors when at the Top
     */
    if (!event.metaKey && (event.key == "ArrowUp")) {
        let previousNode: Node | undefined = getPreviousNodeInTheOnlyGrossWayPossible(editor, editorLevel)
        if (!previousNode) {
            return
        }

        console.log(previousNode)
        const isPreviousBlockVoid: boolean = [PEAK_LEARNING, ELEMENT_CODE_BLOCK].includes(previousNode.type as string)
        if (isPreviousBlockVoid && (isAtFirstLineOfLearning(editor, editorLevel) || isTopLevel(editor, editorLevel))) {
            console.log(`Previous Node is a Voidable`)
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
        let previousNode: Node | undefined = getPreviousNodeInTheOnlyGrossWayPossible(editor, editorLevel)
        if (!previousNode) {
            return
        }

        const selectionCollapsedAndAtStart: boolean = isSelectionAtBlockStart(editor) && Range.isCollapsed(editor.selection!)
        const isPreviousBlockVoid: boolean = [PEAK_LEARNING, ELEMENT_CODE_BLOCK].includes(previousNode.type as string)
        if (isPreviousBlockVoid && (isAtFirstLineOfLearning(editor, editorLevel) || isTopLevel(editor, editorLevel)) && (selectionCollapsedAndAtStart)) {
            const id: string = previousNode.type === PEAK_LEARNING ? previousNode.id as string : previousNode.code_id as string
            dispatch(setEditorFocusToNode({ pageId: currentPageId, nodeId: id, focused: true}))
        }
    }
}


// -----------------------------------
// Helpers
// -----------------------------------
function getPreviousNodeInTheOnlyGrossWayPossible(editor: ReactEditor, level: number): Node | undefined {
    const currentPath = editor.selection?.anchor.path
    let previousNode: Node = undefined

    const [firstNode] = Editor.first(editor, [])
    const firstPath = ReactEditor.findPath(editor, firstNode)
    if (firstPath && currentPath && !isEqual(firstPath, currentPath)) {

        const [wtf, nodes] = Editor.nodes(editor, {
            mode: 'all',
            at: [],
            match: n => {
                return Node.isNode(n)
            },
        });

        // We are in the Journal. Account for the JournalEntry and Header
        if (level === 2 && currentPath[level] !== 0) {
            const journalEntryIndex = currentPath[1]
            const currentNodeIndex = currentPath[level]
            const aboveNodeIndex = currentNodeIndex - 1
            const journalEntry = nodes[0].children[journalEntryIndex]
            previousNode = journalEntry.children[aboveNodeIndex]
        } else {
            // We are in the Wiki. Account for the JournalEntry and Header
            const currentNodeIndex = currentPath[level]
            const aboveNodeIndex = currentNodeIndex - 1
            previousNode = nodes[0].children[aboveNodeIndex]
        }

    }
    return previousNode
}

function getNextNodeInTheOnlyGrossWayPossible(editor: ReactEditor, level: number): Node | undefined {
    const currentPath = editor.selection?.anchor.path
    let nextNode: Node = undefined

    const [lastNode] = Editor.last(editor, [])
    const lastPath = ReactEditor.findPath(editor, lastNode)
    if (lastPath && currentPath && !isEqual(lastPath, currentPath)) {

        const [wtf, nodes] = Editor.nodes(editor, {
            mode: 'all',
            at: [],
            match: n => {
                return Node.isNode(n)
            },
        });

        // We are in the Journal. Account for the JournalEntry and Header
        if (level === 2 && currentPath[level] !== 0) {
            const journalEntryIndex = currentPath[1]
            const currentNodeIndex = currentPath[level]
            const belowNodeIndex = currentNodeIndex + 1
            const journalEntry = nodes[0].children[journalEntryIndex]
            nextNode = journalEntry.children[belowNodeIndex]
        } else {
            // We are in the Wiki. Account for the JournalEntry and Header
            const currentNodeIndex = currentPath[level]
            const belowNodeIndex = currentNodeIndex + 1
            nextNode = nodes[0].children[belowNodeIndex]
        }

    }
    return nextNode
}

function getCurrentLevel(editor: Editor): number {
    return Array.from(Node.levels(editor, editor.selection!.anchor.path)).length
}

function isTopLevel(editor: Editor, editorLevel: number): boolean {
    return getCurrentLevel(editor) === editorLevel + 3
}

function isAtFirstLineOfLearning(editor: Editor, editorLevel: number): boolean {
    const [currNode, currPath] = Editor.above(editor)
    const [currParent, currParentPath] = Editor.parent(editor, currPath)

    const firstBorn = currParent.children[0]
    return currParent.type === PEAK_LEARNING && firstBorn.id === currNode.id
}
function isAtLastLineOfLearning(editor: Editor, editorLevel: number): boolean {
    const [currNode, currPath] = Editor.above(editor)
    const [currParent, currParentPath] = Editor.parent(editor, currPath)
    const [lastChildNode] = currParent.children.slice(-1)
    return currParent.type === PEAK_LEARNING && lastChildNode.id === currNode.id
}
