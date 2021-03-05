import {Editor, Node, Range, Transforms} from "slate";
import {ELEMENT_LINK, ELEMENT_PARAGRAPH} from "@udecode/slate-plugins";
import {message} from "antd";

interface UpsertLinkProps {
    text: string
    link: string
    selection: Range
    editor: Editor
    id?: string
}

/**
 * This should always be the function called for inserting a link
 * @param upsertLinkProps
 */
export const upsertLink = (upsertLinkProps: UpsertLinkProps) => {
    const { text, link, selection, editor, id } = upsertLinkProps;

    // If inserting a new Link
    const insertLink = (newText: string, newUrl: string, theSelection: Range) => {
        const isCollapsed = theSelection && Range.isCollapsed(theSelection);
        const newLinkId = generateIdForLink(newUrl, newText)

        const link: Node = {
            id: newLinkId,
            selectionRange: theSelection,
            type: ELEMENT_LINK,
            link: newUrl,
            children: [{ text: newText }]
        };

        if (isCollapsed) {
            Transforms.insertNodes(editor, link, {at: theSelection});
        } else {
            Transforms.wrapNodes(editor, link, { split: true, at: theSelection });
            Transforms.collapse(editor, { edge: 'end' });
            Transforms.setNodes(editor, {type: ELEMENT_PARAGRAPH})
            Transforms.setSelection(editor, {type: ELEMENT_PARAGRAPH})
        }
        return findLink(editor, newLinkId);
    }

    // If removing the link
    if (!link || !text) {
        unWrapLink(editor, selection)
        return null
    }

    // If updating an existing link
    if (id && isLinkActiveAtSelection(editor, selection)) {
        // TODO: INC oldText and oldURL into above check
        const existingLink = findLink(editor, id);

        if (existingLink) {
            Transforms.setNodes(editor, { link: link, id: id }, {
                at: existingLink[1],
            });
            Transforms.insertText(editor, text, { at: existingLink[1]})
        } else {
            message.info(`Links on links confuse me. Try removing the first link before adding the second`)
        }
        return existingLink
    } else {
        return insertLink(text, link, selection)
    }
};

/**
 * Removing the link. We only
 * @param editor
 * @param selection
 */
export const unWrapLink = (editor: Editor, selection: Range) => {
    Transforms.setNodes(editor, { }, {
        at: selection,
    });
    Transforms.unwrapNodes(editor, { match: n => n.type === ELEMENT_LINK, at: selection });
};

// --------------------------
// Helpers
// --------------------------
export const isLinkActiveAtSelection = (editor: Editor, selection: Range) => {
    const [link] = Editor.nodes(editor, {
        match: n => n.type === ELEMENT_LINK,
        at: selection
    });

    return !!link;
};

export const findLink = (editor: Editor, id: string) => {
    const [nodes] = Editor.nodes(editor, {
        mode: 'all',
        at: [],
        match: n => {
            return (n.type === ELEMENT_LINK && n.link && n.id == id )
        },
    });
    // const matchingNodes = nodes.map(n => n[0])
    return nodes
};

const generateIdForLink = (link: string, displayText: string) => {
    // Return a random number between 1 and 100 for the ID
    const rand = Math.floor((Math.random() * 100) + 1);
    return `${link}-${displayText}-${rand}`
}