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

    if (!event.metaKey && event.key == "ArrowDown") {
        const currentPath = editor.selection?.anchor.path
        const [lastNode] = Editor.last(editor, [])
        const lastPath = ReactEditor.findPath(editor, lastNode)
        const currNode = Editor.above(editor)
        console.log(`CURRENT NODE`)
        console.log(currNode)
        console.log(editor.selection)
        if (lastPath && currentPath && !isEqual(lastPath, currentPath)) {
            const [nextNode, path] = Editor.next(editor);
            console.log(`GOING DOWN toooo`)
            console.log(nextNode)
            if (nextNode && nextNode.code_id) {
                event.preventDefault()
                // @ts-ignore
                dispatch(setEditorFocusToNode({ pageId: currentPageId, nodeId: nextNode.code_id, focused: true}))
            }
        }
    }

    if (!event.metaKey && (event.key == "ArrowUp")) {
        let previousNode: Node | undefined = getPreviousNodeInTheOnlyGrossWayPossible(editor, editorLevel)
        if (!previousNode) {
            return
        }

        switch (previousNode.type) {
            case ELEMENT_CODE_BLOCK:
                console.log(`WERE BELOW A CODE BLOCk`)
                event.preventDefault()
                // @ts-ignore
                dispatch(setEditorFocusToNode({ pageId: currentPageId, nodeId: previousNode.code_id, focused: true}))
                return
            case PEAK_LEARNING:
                dispatch(setEditorFocusToNode({ pageId: currentPageId, nodeId: previousNode.id as string, focused: true}))
                return
        }
    }

    if (!event.metaKey && event.key == "Backspace") {
        let previousNode: Node | undefined = getPreviousNodeInTheOnlyGrossWayPossible(editor, editorLevel)
        if (!previousNode) {
            return
        }

        const selectionCollapsedAndAtStart: boolean = isSelectionAtBlockStart(editor) && Range.isCollapsed(editor.selection!)
        if ([PEAK_LEARNING, ELEMENT_CODE_BLOCK].includes(previousNode.type as string) && (selectionCollapsedAndAtStart)) {
            event.preventDefault()
            const id: string = previousNode.type === PEAK_LEARNING ? previousNode.id as string : previousNode.code_id as string
            dispatch(setEditorFocusToNode({ pageId: currentPageId, nodeId: id, focused: true}))
        }

    }

}

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

