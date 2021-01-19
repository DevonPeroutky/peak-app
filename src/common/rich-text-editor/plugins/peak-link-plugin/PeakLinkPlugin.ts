import {
    DEFAULTS_LINK,
    deserializeLink,
    setDefaults,
    SlatePlugin
} from "@udecode/slate-plugins";
import renderElementLink from "./PeakHyperLink";
import {Editor, Node, Range} from "slate";
import {closeLinkMenu, openEditLinkMenu, openEmptyLinkMenu} from "../../../../redux/slices/wikiPageSlice";
import {store} from "../../../../redux/store";
import {getCurrentPageId} from "../../../../utils/links";
import {PeakHyperlinkState} from "../../../../constants/wiki-types";

export const PeakLinkPlugin = (options?: any): SlatePlugin => {
    const { link } = setDefaults(options, DEFAULTS_LINK);

    return {
        renderElement: renderElementLink(options),
        deserialize: deserializeLink(options),
        onKeyDown: peakLinkOnKeyDownHandler,
        inlineTypes: [link.type]
    }
};
export const peakLinkOnKeyDownHandler = (event: any, editor: Editor) => {
    if (event.metaKey && event.key == 'l') {
        event.preventDefault();
        const [...match] = Editor.nodes(editor, { match: n => n.type === "a" });
        const currentPageId = getCurrentPageId()

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
            store.dispatch(openEditLinkMenu({ pageId: currentPageId, hyperlinkState: currentHyperlink} ));
        } else {
            store.dispatch(openEmptyLinkMenu(currentPageId));
        }
    }

    if (event.key === 'Escape') {
        const currentPageId = getCurrentPageId()
        store.dispatch(closeLinkMenu(currentPageId));
    }
}
