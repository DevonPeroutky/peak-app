import { useCallback, useState } from 'react';
import {Editor, Path, Point, Range, Transforms} from 'slate';
import {
    autoformatBlock,
    getNextIndex,
    getPreviousIndex,
    getRangeFromBlockStart,
    isCollapsed,
    isPointAtWordEnd,
    isWordAfterTrigger,
    unwrapList,
    UseMentionOptions
} from "@udecode/slate-plugins";
import {PeakNodeSelectListItem} from "./types";
import {NODE_CONTENT_LIST_ITEMS} from "../../../peak-toolbar/toolbar-controls";
import {createCreateNewBookListItem} from "./constants";
import {convertPeakBookToNodeSelectListItem, isTextAfterTrigger} from "./utils";
import {createNewPeakBook, useBooks} from "../../../../client/books";
import {useCurrentUser} from "../../../../utils/hooks";
import {ELEMENT_PEAK_BOOK, PEAK_BOOK_SELECT_ITEM} from "../../plugins/peak-knowledge-plugin/constants";

export const useNodeContentSelect = (
    { maxSuggestions = 10, trigger = '/', ...options }: UseMentionOptions = {}
) => {
    const currentUser = useCurrentUser()
    const booksSelectItems: PeakNodeSelectListItem[] = useBooks().map(convertPeakBookToNodeSelectListItem)

    // "Component" State
    const [nodeContentSelectMode, setNodeSelectMode] = useState(true)
    const [targetRange, setTargetRange] = useState<Range | null>(null);
    const [valueIndex, setValueIndex] = useState(0);
    const [menuItems, setMenuItems] = useState(NODE_CONTENT_LIST_ITEMS);
    const [search, setSearch] = useState('');
    const filterValues = () => {
        const filteredValues: PeakNodeSelectListItem[] = menuItems
             .filter((c) => c.title.toLowerCase().includes(search.toLowerCase()))
             .slice(0, maxSuggestions);

        const createNewItem: PeakNodeSelectListItem = createCreateNewBookListItem(search)
        return (!nodeContentSelectMode && search) ? [...filteredValues, createNewItem] : filteredValues
    }
    const values = filterValues();

    const resetNodeMenuItem = () => {
        console.log(`RESETTING`)
        setNodeSelectMode(true)
        setMenuItems(NODE_CONTENT_LIST_ITEMS)
    }

    const onAddNodeContent = useCallback(
        (editor: Editor, data: PeakNodeSelectListItem) => {
            if (targetRange !== null) {
                if (data.elementType === PEAK_BOOK_SELECT_ITEM) {
                    setSearch('')
                    setMenuItems(booksSelectItems)
                    setNodeSelectMode(false)
                    Transforms.select(editor, targetRange);
                    Transforms.insertText(editor, '/', { at: editor.selection! } )
                    return setTargetRange(null);
                } else {
                    Transforms.select(editor, targetRange);
                    Transforms.insertText(editor, '')

                    // IF CREATING A NEW BOOK
                    // We need to insert w/The ID
                    if (data.elementType === ELEMENT_PEAK_BOOK && data.knowledgeNodeId && data.knowledgeNodeId === "-1") {
                        createNewPeakBook(currentUser.id, data.title).then((newPeakBookItem) => {
                            insertNodeContent(editor, newPeakBookItem, targetRange)
                            resetNodeMenuItem()
                            return setTargetRange(null);
                        })
                    } else {
                        insertNodeContent(editor, data, targetRange)
                        resetNodeMenuItem()
                        return setTargetRange(null);
                    }
                }
            }
        },
        [options, targetRange]
    );

    const onKeyDownMention = useCallback(
        (e, editor: Editor) => {
            if (targetRange) {
                if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    return setValueIndex(getNextIndex(valueIndex, values.length - 1));
                }
                if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    return setValueIndex(getPreviousIndex(valueIndex, values.length - 1));
                }
                if (e.key === 'Escape') {
                    e.preventDefault();
                    resetNodeMenuItem();
                    return setTargetRange(null);
                }

                if (e.key === 'Backspace' && search.length === 0) {
                    resetNodeMenuItem();
                    return setTargetRange(null);
                }

                if (['Tab', 'Enter'].includes(e.key)) {
                    e.preventDefault();
                    if (values.length) {
                        onAddNodeContent(editor, values[valueIndex])
                        return false
                    } else {
                        Editor.insertBreak(editor)
                    }
                }
            }
        },
        [
            values,
            valueIndex,
            setValueIndex,
            targetRange,
            onAddNodeContent,
        ]
    );

    const onChangeMention = useCallback(
        (editor: Editor) => {
            const { selection } = editor;

            if (selection && isCollapsed(selection)) {
                const cursor = Range.start(selection);
                const atEnd: boolean = isPointAtWordEnd(editor, { at: cursor })

                // If we are searching through books
                if (!nodeContentSelectMode) {
                    if (cursor.offset === 0) {
                        resetNodeMenuItem()
                    }

                    const { range, match: beforeMatch } = isTextAfterTrigger(editor, {at: cursor, trigger})

                    if (atEnd && beforeMatch) {
                        const [, word] = beforeMatch;
                        const pointAtStartOfLine: Point = {path: range.focus.path, offset: 0}
                        const rangePinnedToStartOfLine: Range = {anchor: pointAtStartOfLine, focus: range.focus}
                        setTargetRange(rangePinnedToStartOfLine as Range);
                        setSearch(word);
                        setValueIndex(0);
                        return
                    }
                }

                // If we are searching through NodeTypes (The default menu)
                if (nodeContentSelectMode) {
                    const { range, match: beforeMatch } = isWordAfterTrigger(editor, {
                        at: cursor,
                        trigger,
                    });

                    if (atEnd && beforeMatch) {
                        setTargetRange(range as Range);
                        const [, word] = beforeMatch;
                        setSearch(word);
                        setValueIndex(0);
                        return;
                    }
                }
            }

            setTargetRange(null);
        },
        [targetRange, setTargetRange, nodeContentSelectMode, setSearch, setValueIndex, trigger, search]
    );

    return {
        search,
        index: valueIndex,
        target: targetRange,
        values,
        onChangeMention,
        onKeyDownMention,
        onAddNodeContent,
        nodeContentSelectMode
    };
};

export const insertNodeContent = async (
    editor: Editor,
    selectedOption: PeakNodeSelectListItem,
    targetRange: Range
) => {
    const rangeFromBlockStart = getRangeFromBlockStart(editor) as Range;
    autoformatBlock(editor, selectedOption.elementType, rangeFromBlockStart, {
        preFormat: () => {
            unwrapList(editor);
        },
        format: selectedOption.customFormat
    });
    Transforms.insertText(editor, '', { at: editor.selection! } )
};
