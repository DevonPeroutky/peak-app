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
import {PEAK_BOOK_SELECT_ITEM} from "../../plugins/peak-book-plugin/defaults";
import {BASIC_LIBRARY, createCreateNewBookListItem} from "./constants";
import {isTextAfterTrigger} from "./utils";

export const useNodeContentSelect = (
    { maxSuggestions = 10, trigger = '/', ...options }: UseMentionOptions = {}
) => {
    const [nodeSelectMode, setNodeSelectMode] = useState(true)
    const [targetRange, setTargetRange] = useState<Range | null>(null);
    const [valueIndex, setValueIndex] = useState(0);
    const [menuItems, setMenuItems] = useState(NODE_CONTENT_LIST_ITEMS);
    const [search, setSearch] = useState('');
    const filterValues = () => {
        const filteredValues: PeakNodeSelectListItem[] = menuItems
             .filter((c) => c.title.toLowerCase().includes(search.toLowerCase()))
             .slice(0, maxSuggestions);

        const createNewItem: PeakNodeSelectListItem = createCreateNewBookListItem(search)
        return (!nodeSelectMode && search) ? [...filteredValues, createNewItem] : filteredValues
    }
    const values = filterValues();

    const resetNodeMenuItem = () => {
        console.log(`Resetting the Node Menu Item`)
        setNodeSelectMode(true)
        setMenuItems(NODE_CONTENT_LIST_ITEMS)
    }

    const onAddNodeContent = useCallback(
        (editor: Editor, data: PeakNodeSelectListItem) => {
            if (targetRange !== null) {
                if (data.elementType === PEAK_BOOK_SELECT_ITEM) {
                    setSearch('')
                    setMenuItems(BASIC_LIBRARY)
                    setNodeSelectMode(false)
                    Transforms.select(editor, targetRange);
                    Transforms.insertText(editor, '/', { at: editor.selection! } )
                    return setTargetRange(null);
                } else {
                    Transforms.select(editor, targetRange);
                    Transforms.insertText(editor, '')
                    insertNodeContent(editor, data, targetRange)
                    resetNodeMenuItem()
                    return setTargetRange(null);
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
                    console.log(`CURRENT VALUES`)
                    console.log(values)
                    if (values.length) {
                        console.log(`WHAT IS SUP`)
                        onAddNodeContent(editor, values[valueIndex])
                        return false
                    } else {
                        console.log(`INSERTING BREAK`)
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
                if (!nodeSelectMode) {
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
                if (nodeSelectMode) {
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
        [targetRange, setTargetRange, nodeSelectMode, setSearch, setValueIndex, trigger, search]
    );

    return {
        search,
        index: valueIndex,
        target: targetRange,
        values,
        onChangeMention,
        onKeyDownMention,
        onAddNodeContent,
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
