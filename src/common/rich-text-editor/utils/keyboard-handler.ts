import {ELEMENT_OL, ELEMENT_UL, isSelectionAtBlockStart, toggleList} from "@udecode/slate-plugins";
import {Editor, Node, Range} from "slate";
import {
    closeLinkMenu,
    openEditLinkMenu,
    openEmptyLinkMenu,
    PeakHyperlinkState,
    setCodeEditorFocus
} from "../../../redux/wikiPageSlice";
import {ReactEditor} from "slate-react";
import {isEqual} from "lodash";
import {useCallback} from "react";
import {Dispatch} from "redux";

export const baseKeyBindingHandler = (event: any, editor: ReactEditor, dispatch: Dispatch, currentPageId: string) => {
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
        if (lastPath && currentPath && !isEqual(lastPath, currentPath)) {
            const [nextNode, path] = Editor.next(editor);
            if (nextNode && nextNode.code_id) {
                event.preventDefault()
                dispatch(setCodeEditorFocus({ pageId: currentPageId, codeEditorId: nextNode.code_id, focused: true}))
            }
        }
    }

    if (!event.metaKey && (event.key == "ArrowUp")) {
        const currentPath = editor.selection?.anchor.path
        const [firstNode] = Editor.first(editor, [])
        const firstPath = ReactEditor.findPath(editor, firstNode)

        if (firstPath && currentPath && !isEqual(firstPath, currentPath)) {
            const [previousNode, path] = Editor.previous(editor )
            if (previousNode.code_id) {
                event.preventDefault()
                dispatch(setCodeEditorFocus({ pageId: currentPageId, codeEditorId: previousNode.code_id, focused: true}))
            }
        }
    }

    if (!event.metaKey && event.key == "Backspace") {
        const currentPath = editor.selection?.anchor.path
        const [firstNode] = Editor.first(editor, [])
        const firstPath = ReactEditor.findPath(editor, firstNode)

        if (firstPath && currentPath && !isEqual(firstPath, currentPath)) {
            const [previousNode, path] = Editor.previous(editor, {})
            const selectionCollapsedAndAtStart: boolean = isSelectionAtBlockStart(editor) && Range.isCollapsed(editor.selection!)
            if (previousNode.code_id && (selectionCollapsedAndAtStart)) {
                event.preventDefault()
                dispatch(setCodeEditorFocus({ pageId: currentPageId, codeEditorId: previousNode.code_id, focused: true}))
            }
        }
   }
}
