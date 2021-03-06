import {
    DEFAULTS_LINK,
    setDefaults,
    SlatePlugin
} from "@udecode/slate-plugins";
import renderElementLink from "./PeakHyperLink";
import {Editor, Node, Range} from "slate";
import {closeLinkMenu, openEditLinkMenu, openEmptyLinkMenu} from "../../../../redux/slices/activeEditor/activeEditorSlice";
import {store} from "../../../../redux/store";
import {PeakHyperlinkState} from "../../../../constants/wiki-types";

export const PeakLinkPlugin = (options?: any): SlatePlugin => {
    const { link } = setDefaults(options, DEFAULTS_LINK);

    return {
        renderElement: renderElementLink(options),
        onKeyDown: peakLinkOnKeyDownHandler,
        inlineTypes: [link.type]
    }
};
export const peakLinkOnKeyDownHandler = (event: any, editor: Editor) => {
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
            store.dispatch(openEditLinkMenu({ hyperlinkState: currentHyperlink} ));
        } else {
            store.dispatch(openEmptyLinkMenu());
        }
    }

    if (event.key === 'Escape') {
        store.dispatch(closeLinkMenu());
    }
}
