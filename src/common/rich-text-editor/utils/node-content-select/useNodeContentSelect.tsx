import {useCallback, useEffect, useMemo, useState} from 'react';
import { Editor, Point, Range, Transforms } from 'slate';
import {
    ELEMENT_LIC,
    ELEMENT_PARAGRAPH,
    getNextIndex,
    getPreviousIndex,
    isCollapsed,
    isPointAtWordEnd,
    isWordAfterTrigger, OnChange, OnKeyDown, SPEditor,
} from "@udecode/slate-plugins";
import {PeakNodeSelectListItem} from "./types";
import {NODE_CONTENT_LIST_ITEMS} from "../../../peak-toolbar/toolbar-controls";
import {createCreateNewBookListItem} from "./constants";
import {
    convertOpenLibraryBookToNodeSelectListItem,
    convertPeakBookToNodeSelectListItem, insertNodeContent,
    isTextAfterTrigger
} from "./utils";
import {useBooks} from "../../../../client/notes";
import {ELEMENT_PEAK_BOOK, PEAK_BOOK_SELECT_ITEM} from "../../plugins/peak-knowledge-plugin/constants";
import {isAtTopLevelOfEditor} from "../base-utils";
import {OpenLibraryBook, useDebounceOpenLibrarySearcher} from "../../../../client/openLibrary";
import {useHistory} from "react-router-dom";
import {buildNoteUrl} from "../../../../utils/notes";

export const useNodeContentSelect = (
    { maxSuggestions = 10, trigger = '/', editorLevel = 1, ...options }
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
        return openLibraryBooks
    }
    const library: OpenLibraryBook[] = searchLibary()

    useEffect(() => {
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
        (editor: SPEditor, data: PeakNodeSelectListItem) => {
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

                    if (data.elementType === ELEMENT_PEAK_BOOK) {
                        // IF CREATING A NEW BOOK
                        if (data.knowledgeNodeId && data.knowledgeNodeId === "-1" || data.knowledgeNodeId === "-69") {
                            return new Promise(function(resolve, reject) {
                                resetNodeMenuItem()
                                resolve(setTargetRange(null))
                            }).then(() => history.push(`/home/draft-book?title=${data.title}&author=${data.author}&cover-id=${data.coverId}`))

                        // IF Referencing a book
                        } else {
                            return new Promise(function(resolve, reject) {
                                resetNodeMenuItem()
                                resolve(setTargetRange(null))
                            }).then(() => history.push(buildNoteUrl(data.noteId)))

                        }
                    }

                    // Insert Normally
                    insertNodeContent(editor, data, targetRange)
                    resetNodeMenuItem()
                    return setTargetRange(null);
                }
            }
        },
        [targetRange]
        // [options, targetRange]
    );

    const onKeyDownSelect: OnKeyDown = useCallback(
        (editor: SPEditor) => (e) => {
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
            targetRange,
            onAddNodeContent,
        ]
    )

    const onChangeMention: OnChange = useCallback((editor: SPEditor ) => {
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
                // Change this to open up by default once they trigger
                const { range, match: beforeMatch } = isWordAfterTrigger(editor, {
                    at: cursor,
                    trigger,
                });
                const [currNode, currPath] = Editor.above(editor)

                // Restrict NodeSelectMenu to paragraph nodes at (exclusively the top-leve) for sanity reasons
                const atTopLevel: boolean = isAtTopLevelOfEditor(editor.selection, editorLevel)
                const currentlyInParagraphNode: boolean = currNode.type === ELEMENT_PARAGRAPH || currNode.type === ELEMENT_LIC
                console.log(`CURR NODE: ${atTopLevel}`, currNode.type)

                if (atEnd && beforeMatch && currentlyInParagraphNode && atTopLevel) {
                // if (atEnd && beforeMatch) {
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
        [setTargetRange, setSearch, setValueIndex, trigger, nodeContentSelectMode]
            // [targetRange, setTargetRange, nodeContentSelectMode, setSearch, setValueIndex, trigger, search, library]
    ) as OnChange;


    /**
     onChange: onChangeMention,
     onKeyDown: onKeyDownMention,
     */
    return {
        plugin: useMemo(() => ({
            onChange: onChangeMention,
            onKeyDown: onKeyDownSelect,
        }), [onChangeMention, onKeyDownSelect]),
        getNodeContentSelectProps: useCallback(
            () => ({
                nodeContentSelectMode,
                at: targetRange,
                valueIndex,
                options: values,
                onAddNodeContent: onAddNodeContent,
                openLibraryBooks: library,
            }),
            [onAddNodeContent, search, targetRange, valueIndex, values, library]
        ),
        search: search
    };
};

