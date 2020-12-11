import {
    ELEMENT_OL,
    ELEMENT_UL,
    toggleList
} from "@udecode/slate-plugins";
import {Editor, Node, Range, Transforms} from "slate";
import {
    closeLinkMenu,
    openEditLinkMenu,
    openEmptyLinkMenu,
    PeakHyperlinkState,
} from "../../../redux/wikiPageSlice";
import {ReactEditor} from "slate-react";
import {Dispatch} from "redux";

export const baseKeyBindingHandler = (event: any, editor: ReactEditor, dispatch: Dispatch, currentPageId: string) => {
    const currentPath = editor.selection?.anchor.path
    if (currentPath === undefined)  { return }

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
}

