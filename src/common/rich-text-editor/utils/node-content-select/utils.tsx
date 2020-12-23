import React from "react";
import {PeakEditorControlDisplay} from "../../../peak-toolbar/toolbar-controls";
import {PeakNodeSelectListItem} from "./types";
import {Editor, Point, Range} from "slate";
import {escapeRegExp, getText} from "@udecode/slate-plugins";
import {PeakBook} from "../../../../redux/slices/booksSlice";
import {ELEMENT_PEAK_BOOK} from "../../plugins/peak-book-plugin/defaults";
import {insertCustomBlockElement} from "../base-utils";
import {ReadOutlined} from "@ant-design/icons/lib";

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

export function convertPeakBookToNodeSelectListItem(book: PeakBook): PeakNodeSelectListItem {
    return {
        title: book.title,
        label: book.title,
        elementType: ELEMENT_PEAK_BOOK,
        customFormat: insertBookElementCallback(book),
        icon: <ReadOutlined className={"inline-select-item-icon"}/>
    }
}

export function insertBookElementCallback(book: PeakBook): (editor: Editor) => void {
    return (editor => insertCustomBlockElement(editor, ELEMENT_PEAK_BOOK, {bookId: book.id, title: book.title}))
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