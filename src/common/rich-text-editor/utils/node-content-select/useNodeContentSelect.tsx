import {useCallback, useEffect, useState} from 'react';
import { Editor, Point, Range, Transforms } from 'slate';
import {
    ELEMENT_PARAGRAPH,
    getNextIndex,
    getPreviousIndex,
    isCollapsed,
    isPointAtWordEnd,
    isWordAfterTrigger,
    UseMentionOptions
} from "@udecode/slate-plugins";
import {PeakNodeSelectListItem} from "./types";
import {NODE_CONTENT_LIST_ITEMS} from "../../../peak-toolbar/toolbar-controls";
import {createCreateNewBookListItem} from "./constants";
import {
    convertOpenLibraryBookToNodeSelectListItem,
    convertPeakBookToNodeSelectListItem, insertNodeContent,
    isTextAfterTrigger
} from "./utils";
import {createNewPeakBook, useBooks} from "../../../../client/notes";
import {ELEMENT_PEAK_BOOK, PEAK_BOOK_SELECT_ITEM} from "../../plugins/peak-knowledge-plugin/constants";
import {isAtTopLevelOfEditor} from "../base-utils";
import {OpenLibraryBook, useDebounceOpenLibrarySearcher} from "../../../../client/openLibrary";
import {useHistory} from "react-router-dom";

interface PeakNodeSelectMenuOptions extends UseMentionOptions {
    editorLevel: number
}

export const useNodeContentSelect = (
    { maxSuggestions = 10, trigger = '/', editorLevel, ...options }: PeakNodeSelectMenuOptions
) => {

    let history = useHistory();
    const books = useBooks()
    const openLibrarySearcher = useDebounceOpenLibrarySearcher()

    const [bookSelectItems, setBookSelectItems] = useState<PeakNodeSelectListItem[]>([])
    const [nodeContentSelectMode, setNodeSelectMode] = useState(true)
    const [targetRange, setTargetRange] = useState<Range | null>(null);
    const [valueIndex, setValueIndex] = useState(0);
    const [menuItems, setMenuItems] = useState(NODE_CONTENT_LIST_ITEMS);
    const [openLibraryBooks, setOpenLibraryBooks] = useState<OpenLibraryBook[]>([]);
    const [search, setSearch] = useState('');

    const filterValues = () => {
        const filteredValues: PeakNodeSelectListItem[] = menuItems
             .filter((c) => c.title.toLowerCase().includes(search.toLowerCase()))
             .slice(0, maxSuggestions);

        const createNewItem: PeakNodeSelectListItem = createCreateNewBookListItem(search)
        return (!nodeContentSelectMode && search) ? [...filteredValues, createNewItem] : filteredValues
    }
    const values = filterValues();

    const searchLibary = () => {
        const newThings = openLibraryBooks
        return newThings
    }
    const library: OpenLibraryBook[] = searchLibary()

    useEffect(() => {
        console.log(`SET BOOK SELECT ITEMS `, books)
        setBookSelectItems(books.map(convertPeakBookToNodeSelectListItem))
    }, [books.length]);

    // OpenLibrary response may come after we reset NodeList
    useEffect(() => {
        if (nodeContentSelectMode && library.length > 1) {
            setOpenLibraryBooks([])
        }
    }, [library]);

    const resetNodeMenuItem = () => {
        setNodeSelectMode(true)
        setMenuItems(NODE_CONTENT_LIST_ITEMS)
        setOpenLibraryBooks([])
    }

    const onAddNodeContent = useCallback(
        (editor: Editor, data: PeakNodeSelectListItem) => {
            console.log(`THE DATA: `, data)
            if (targetRange !== null) {
                if (data.elementType === PEAK_BOOK_SELECT_ITEM) {
                    setSearch('')
                    setMenuItems(bookSelectItems)
                    setNodeSelectMode(false)
                    Transforms.select(editor, targetRange);
                    Transforms.insertText(editor, '/', { at: editor.selection! } )
                    return setTargetRange(null);
                } else {
                    Transforms.select(editor, targetRange);
                    Transforms.insertText(editor, '')

                    // IF CREATING A NEW BOOK
                    // We need to insert w/The ID
                    if (data.elementType === ELEMENT_PEAK_BOOK && data.knowledgeNodeId && data.knowledgeNodeId === "-1" || data.knowledgeNodeId === "-69") {
                        // createNewPeakBook(currentUser.id, data).then((newPeakBookItem) => {
                        //     insertNodeContent(editor, newPeakBookItem, targetRange)
                        //     resetNodeMenuItem()
                        //     return setTargetRange(null);
                        // })
                        console.log(`MOVING TO THE DRAFTTTT /home/draft-book?title=${data.title}&author=${data.author}&cover-id=${data.coverId}`)
                        history.push(`/home/draft-book?title=${data.title}&author=${data.author}&cover-id=${data.coverId}`);
                        resetNodeMenuItem()
                        return setTargetRange(null);
                    } else {
                        console.log(`MOVING TO THE EXISTING BOOK /notes/${data.bookId}`)
                        history.push(`/home/notes/${data.bookId}`);
                        resetNodeMenuItem()
                        return setTargetRange(null);
                    }
                }
            }
        },
        [options, targetRange]
    );

    const onKeyDownSelect = useCallback((e, editor: Editor) => {
            const totalMax: number = Math.max(values.length, 1) + library.length - 1
            if (targetRange) {
                if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    return setValueIndex(getNextIndex(valueIndex, totalMax));
                }
                if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    return setValueIndex(getPreviousIndex(valueIndex, totalMax));
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
                        console.log(`Values `, values)
                        console.log(`Books `, books)
                        console.log(`ValueIndex `, valueIndex)
                        const fullOptions: PeakNodeSelectListItem[] = [...values, ...library.map(convertOpenLibraryBookToNodeSelectListItem)]
                        onAddNodeContent(editor, fullOptions[valueIndex])
                        return false
                    } else {
                        Editor.insertBreak(editor)
                    }
                }
            }
        },[
            values,
            valueIndex,
            library,
            setValueIndex,
            targetRange,
            onAddNodeContent,
        ]
    )

    const onChangeMention = useCallback(
        (editor: Editor, ) => {
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

                        if (word) {
                            openLibrarySearcher(word, setOpenLibraryBooks)
                        }

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
                    const [currNode, currPath] = Editor.above(editor)

                    // Restrict NodeSelectMenu to paragraph nodes at (exclusively the top-leve) for sanity reasons
                    const atTopLevel: boolean = isAtTopLevelOfEditor(editor.selection, editorLevel)
                    const currentlyInParagraphNode: boolean = currNode.type === ELEMENT_PARAGRAPH

                    if (atEnd && beforeMatch && currentlyInParagraphNode && atTopLevel) {
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
        [targetRange, setTargetRange, nodeContentSelectMode, setSearch, setValueIndex, trigger, search, library]
    );

    return {
        search,
        index: valueIndex,
        target: targetRange,
        values,
        openLibraryResults: library,
        onChangeMention,
        onKeyDownSelect,
        onAddNodeContent,
        nodeContentSelectMode
    };
};

