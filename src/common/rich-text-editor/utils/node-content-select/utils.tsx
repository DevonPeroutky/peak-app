import React from "react";
import {PeakEditorControlDisplay} from "../../../peak-toolbar/toolbar-controls";
import {PeakNodeSelectListItem} from "./types";
import {Editor, Location, Point, Range, Transforms} from "slate";
import {escapeRegExp, getRangeFromBlockStart, getText, unwrapList} from "@udecode/slate-plugins";
import {insertCustomBlockElement, insertCustomBlockElementCallback} from "../base-utils";
import {ReadOutlined} from "@ant-design/icons/lib";
import {ELEMENT_PEAK_BOOK} from "../../plugins/peak-knowledge-plugin/constants";
import {PeakNote} from "../../../../redux/slices/noteSlice";
import {getCoverImageUrl, OpenLibraryBook} from "../../../../client/openLibrary";
import {ImageLoader} from "../../../image-loader/ImageLoader";
import {uniq} from "ramda";

export function convertEditorControlDisplayToNodeSelectListItem(node: PeakEditorControlDisplay): PeakNodeSelectListItem {
    return {
        title: node.label,
        label: node.label,
        elementType: node.elementType,
        description: node.description,
        customFormat: node.customFormat,
        hotkeyInstructionArray: node.hotkeyInstructionArray,
        icon: node.icon
    }
}

export function convertPeakBookToNodeSelectListItem(book: PeakNote): PeakNodeSelectListItem {
    return {
        title: book.title,
        label: book.title,
        noteId: book.id,
        description: book.author,
        author: book.author,
        elementType: ELEMENT_PEAK_BOOK,
        customFormat: insertBookElementCallback(book),
        icon: <ImageLoader
            url={book.icon_url}
            className={"peak-node-select-book-cover"}
            fallbackElement={<ReadOutlined className={"inline-select-item-icon"}/>}
        />
    }
}

export function convertOpenLibraryBookToNodeSelectListItem(book: OpenLibraryBook): PeakNodeSelectListItem {
    const author: string = (book.author_name) ? uniq(book.author_name).join(", ") : ""
    return {
        title: book.title,
        label: `${book.title}`,
        description: author,
        coverId: book.cover_i,
        author: author,
        iconUrl: (book.cover_i) ? getCoverImageUrl(book.cover_i, "M") : undefined,
        knowledgeNodeId: "-69",
        elementType: ELEMENT_PEAK_BOOK,
        customFormat: (editor => insertCustomBlockElementCallback(ELEMENT_PEAK_BOOK,{knowledgeNodeId: "-1", title: book.title})(editor)),
        icon: <ImageLoader
            url={(book.cover_i !== undefined) ? getCoverImageUrl(book.cover_i, "S") : "bogus"}
            className={"peak-node-select-book-cover"}
            fallbackElement={<ReadOutlined className={"peak-node-select-book-cover"}/>}
        />
    }
}

export function insertBookElementCallback(book: PeakNote): (editor: Editor) => void {
    return (editor => insertCustomBlockElement(editor, ELEMENT_PEAK_BOOK, {noteId: book.id, title: book.title}))
}

/**
 * Is the word at the point after a trigger (punctuation character)
 * https://github.com/ianstormtaylor/slate/blob/master/packages/slate/src/utils/string.ts#L6
 */
export const isTextAfterTrigger = (
    editor: Editor,
    { at, trigger }: { at: Point; trigger: string }
) => {
    // Point at the start of previous word (excluding punctuation)
    const lineBefore = Editor.before(editor, at, { unit: 'line' });
    const currentLine = Editor.before(editor, at, { unit: 'word' });

    // Point before wordBefore
    const before = lineBefore && Editor.before(editor, lineBefore);
    const wordBefore = currentLine && Editor.before(editor, currentLine);

    // Range from before to start
    const beforeRange = before && Editor.range(editor, before, at);
    const currentLineRange: Range = before && Editor.range(editor, wordBefore, at);

    // Before text
    const beforeText = getText(editor, beforeRange);

    // Starts with char and ends with word characters
    const escapedTrigger = escapeRegExp(trigger);
    const beforeRegex = new RegExp(`^${escapedTrigger}(.*$)`);

    // Match regex on before text
    const match = !!beforeText && beforeText.match(beforeRegex);

    return {
        range: currentLineRange,
        match,
    };
};

export const insertNodeContent = async (
    editor: Editor,
    selectedOption: PeakNodeSelectListItem,
    targetRange: Range
) => {
    const rangeAtBlockStart = getRangeFromBlockStart(editor) as Range;
    peakAutoformatBlock(editor, selectedOption.elementType, rangeAtBlockStart, {
        preFormat: () => {
            unwrapList(editor);
        },
        format: selectedOption.customFormat
    });
    Transforms.insertText(editor, '', { at: editor.selection! } )
};

// We need our own implementation of this because we don't want Transforms.delete running for the node select I guess.
// Errors would ensue when using the NodeSelect at the top of a Journal w/at least 2 lines
const peakAutoformatBlock = (
    editor: Editor,
    type: string,
    at: Location,
    {
        preFormat,
        format,
    }: {
        preFormat?: (editor: Editor) => void;
        format?: (editor: Editor) => void;
    }
) => {
    // Transforms.delete(editor, { at });
    preFormat?.(editor);

    if (!format) {
        Transforms.setNodes(
            editor,
            { type },
            { match: (n) => Editor.isBlock(editor, n) }
        );
    } else {
        format(editor);
    }
};
