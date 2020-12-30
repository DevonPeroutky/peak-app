import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {Range} from "slate/dist/interfaces/range";
import {Node} from "slate";
import {differenceWith, omit, uniqBy} from "ramda";
import {ELEMENT_PARAGRAPH} from "@udecode/slate-plugins";
import {EMPTY_JOURNAL_STATE} from "../../common/rich-text-editor/editors/journal/constants";
import {JOURNAL_PAGE_ID} from "./journalSlice";
import {CHROME_EXTENSION} from "../../common/rich-text-editor/editors/chrome-extension/constants";
const R = require('ramda');

interface CodeEditorFocusState {
    [key: string]: boolean
};
export interface PeakHyperlinkState {
    currentLinkUrl: string,
    currentSelection: Range | null,
    currentText: string
    currentHyperLinkId: string,
};
export interface PeakEditorState {
    isEditing: boolean,
    focusMap: CodeEditorFocusState,
    showLinkMenu: boolean,
    currentLinkState: PeakHyperlinkState,
};
export interface PeakWikiPage {
    id: string,
    body: Node[] | JournalEntry[],
    title: string,
    editorState: PeakEditorState,
    isSaving: boolean
}
export interface PeakWikiState {
    [key: string]: PeakWikiPage;
}

export const INITIAL_LINK_STATE: PeakHyperlinkState = {
    currentLinkUrl: '',
    currentSelection: null,
    currentHyperLinkId: '',
    currentText: ''
};

const INITIAL_EDITOR_STATE: PeakEditorState = {
    isEditing: false,
    focusMap: {},
    showLinkMenu: false,
    currentLinkState: INITIAL_LINK_STATE
};
const INITIAL_EDITING_STATE: PeakEditorState = {
    isEditing: true,
    focusMap: {},
    showLinkMenu: false,
    currentLinkState: INITIAL_LINK_STATE,
};

export const INITIAL_PAGE_STATE: PeakWikiPage = {
    id: "-1",
    editorState: INITIAL_EDITING_STATE,
    body: [
        {
            children: [{ type: ELEMENT_PARAGRAPH, children: [{ text: ''}] }],
        }
    ],
    title: '',
    isSaving: false
};

const INITIAL_JOURNAL_STATE: PeakWikiPage = {...INITIAL_PAGE_STATE, body: EMPTY_JOURNAL_STATE, id: JOURNAL_PAGE_ID }
export const INITIAL_CHROME_EXT_STATE: PeakWikiPage = {...INITIAL_PAGE_STATE, id: CHROME_EXTENSION }

export const INITIAL_WIKI_STATE: PeakWikiState = { [JOURNAL_PAGE_ID]: INITIAL_JOURNAL_STATE, [CHROME_EXTENSION]: INITIAL_CHROME_EXT_STATE } ;
export interface JournalEntry {
    id: string
    entry_date: string,
    body: any,
}
export const journalOrdering = (a: JournalEntry, b: JournalEntry) => {
    return (a.entry_date <= b.entry_date) ? 1 : -1
};

export const wikiPageSlice = createSlice({
    name: 'peakWikiState',
    initialState: INITIAL_WIKI_STATE,
    reducers: {
        addPages(state, action: PayloadAction<PeakWikiPage[]>) {
            const wikiPage = action.payload.reduce(function(map, obj) {
                map[obj.id] = {...INITIAL_PAGE_STATE, ...obj};
                return map;
            }, {} as PeakWikiState);
            return {...state, ...wikiPage}
        },
        createPage(state, action: PayloadAction<{pageId: string, newPage: PeakWikiPage}>) {
            const newPage = {...INITIAL_PAGE_STATE, ...action.payload.newPage };
            return { ...state, [action.payload.pageId]: newPage }
        },
        deletePage(state, action: PayloadAction<{pageId: string}>) {
            return omit([action.payload.pageId], state)
        },
        updatePageTitle(state, action: PayloadAction<{ pageId: string, title: string}>) {
            const newPageState = {...state[action.payload.pageId], title: action.payload.title};
            return { ...state, [action.payload.pageId]: newPageState }
        },
        beginSavingPage(state, action: PayloadAction<{ pageId: string}>) {
            const newPageState = {...state[action.payload.pageId], isSaving: true};
            return { ...state, [action.payload.pageId]: newPageState }
        },
        endSavingPage(state, action: PayloadAction<{ pageId: string}>) {
            const newPageState = {...state[action.payload.pageId], isSaving: false};
            return { ...state, [action.payload.pageId]: newPageState }
        },
        updatePageContents(state, action: PayloadAction<{ pageId: string, title: string, body: Node[]}>) {
            const newPageState = {...state[action.payload.pageId], title: action.payload.title, body: action.payload.body};
            return { ...state, [action.payload.pageId]: newPageState }
        },
        openEmptyLinkMenu(state, action: PayloadAction<string>) {
            const newPageEditingState = {...state[action.payload].editorState, showLinkMenu: true};
            const newPageState = {...state[action.payload], editorState: newPageEditingState};
            return { ...state, [action.payload]: newPageState }
        },
        setEditing(state, action: PayloadAction<{ pageId: string, isEditing: boolean }>) {
            if (action.payload.isEditing) {
                const newPageState = {...state[action.payload.pageId], editorState: INITIAL_EDITING_STATE};
                return {...state, [action.payload.pageId]: newPageState }
            } else {
                const newPageState = {...state[action.payload.pageId], editorState: INITIAL_EDITOR_STATE};
                return {...state, [action.payload.pageId]: newPageState }
            }
        },
        closeLinkMenu(state, action: PayloadAction<string>) {
            const newPageEditingState = { ...state[action.payload].editorState, showLinkMenu: false, currentLinkState: INITIAL_LINK_STATE };
            const newPageState = {...state[action.payload], editorState: newPageEditingState};
            return {...state, [action.payload]: newPageState }
        },
        openEditLinkMenu(state, action: PayloadAction<{pageId: string, hyperlinkState: PeakHyperlinkState}>) {
            const newPageEditingState = { ...state[action.payload.pageId].editorState, showLinkMenu: true, currentLinkState: action.payload.hyperlinkState };
            const newPageState = {...state[action.payload.pageId], editorState: newPageEditingState};
            return {...state, [action.payload.pageId]: newPageState }
        },
        setEditorFocusToNode(state, action: PayloadAction<{pageId: string, nodeId: number, focused: boolean }>) {
            const { pageId, nodeId, focused } = action.payload
            const newCodeEditorFocusState = { [nodeId]: focused }
            const newPageEditingState = { ...state[pageId].editorState, focusMap: newCodeEditorFocusState };
            const newPageState = {...state[pageId], editorState: newPageEditingState};
            return {...state, [pageId]: newPageState }
        },
        deleteCodeBlock(state, action: PayloadAction<{pageId: string, nodeId: string}>) {
            const { pageId, nodeId } = action.payload
            const emptyParagraphBlock = { text: "", type: ELEMENT_PARAGRAPH }
            const currentPageBody: Node[] = state[pageId].body as Node[]
            const newPageBody = currentPageBody.map(node => node.id === nodeId ? emptyParagraphBlock : node )
            const newPageState = {...state[pageId], body: newPageBody};
            return {...state, [pageId]: newPageState }
        },
        setJournalEntries(state, action: PayloadAction<JournalEntry[]>) {
            const newJournals: JournalEntry[] = R.sort(journalOrdering, action.payload)
            const existingJournals: JournalEntry[] = state[JOURNAL_PAGE_ID].body as JournalEntry[]
            const updateJournalBody = uniqBy((je: JournalEntry) => je.entry_date, [...newJournals, ...existingJournals])
            const newJournal: PeakWikiPage = {...state[JOURNAL_PAGE_ID], body: updateJournalBody}
            return { ...state, [JOURNAL_PAGE_ID]: newJournal }
        },
        addNewJournalEntry(state, action: PayloadAction<JournalEntry>) {
            const existingJournalBody: JournalEntry[] = state[JOURNAL_PAGE_ID].body as JournalEntry[]
            const newJournalEntry: JournalEntry = action.payload
            const newJournalBody: JournalEntry[] = [newJournalEntry, ...existingJournalBody]
            const newJournalState = {...state[JOURNAL_PAGE_ID], body: newJournalBody }
            return {...state, [JOURNAL_PAGE_ID]: newJournalState }
        },
        updateJournalEntry(state, action: PayloadAction<JournalEntry>) {
            const newEntry: JournalEntry = action.payload
            const existingJournalBody: JournalEntry[] = state[JOURNAL_PAGE_ID].body as JournalEntry[]
            const newJournalBody: JournalEntry[] = R.sort(journalOrdering,[...existingJournalBody.filter(j => j.entry_date !== newEntry.entry_date), newEntry]);
            const newJournalState = {...state[JOURNAL_PAGE_ID], body: newJournalBody }
            return {...state, [JOURNAL_PAGE_ID]: newJournalState};
        },
        updateJournalEntries(state, action: PayloadAction<JournalEntry[]>) {
            const cmp = (e1: JournalEntry, e2: JournalEntry) => e1.entry_date === e2.entry_date
            const updatedEntries: JournalEntry[] = action.payload
            const existingJournalBody: JournalEntry[] = state[JOURNAL_PAGE_ID].body as JournalEntry[]
            const nonModifiedEntries: JournalEntry[] = differenceWith(cmp, existingJournalBody, updatedEntries )
            const newJournalBody: JournalEntry[] = R.sort(journalOrdering,[...nonModifiedEntries, ...updatedEntries])
            const newJournalState = {...state[JOURNAL_PAGE_ID], body: newJournalBody}
            return {...state, [JOURNAL_PAGE_ID]: newJournalState};
        },
        syncToDos(state, action: PayloadAction<string>) {

        }
    }
});

export const {
    deletePage,
    openEmptyLinkMenu,
    setEditing,
    closeLinkMenu,
    openEditLinkMenu,
    addPages,
    updatePageContents,
    createPage,
    updatePageTitle,
    beginSavingPage,
    endSavingPage,
    setEditorFocusToNode,
    setJournalEntries,
    updateJournalEntry,
    updateJournalEntries
} = wikiPageSlice.actions;
export default wikiPageSlice.reducer;