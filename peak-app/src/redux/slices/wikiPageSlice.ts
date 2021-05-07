import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {Node} from "slate";
import {differenceWith, omit, uniqBy} from "ramda";
import {CHROME_EXTENSION} from "../../common/rich-text-editor/editors/chrome-extension/constants";
import {
    INITIAL_CHROME_EXT_STATE,
    INITIAL_JOURNAL_STATE,
    INITIAL_PAGE_STATE,
} from "../../constants/editor";
import {JournalEntry} from "../../common/rich-text-editor/editors/journal/types";
import {JOURNAL_PAGE_ID} from "../../common/rich-text-editor/editors/journal/constants";
import { PeakWikiPage, PeakWikiState} from "../../constants/wiki-types";
import {SCRATCHPAD_ID, SCRATCHPAD_TITLE} from "../../common/rich-text-editor/editors/scratchpad/constants";
import {INITIAL_SCRATCHPAD_STATE} from "../../common/rich-text-editor/editors/scratchpad/constants";
const R = require('ramda');

export const INITIAL_WIKI_STATE: PeakWikiState = {
    [JOURNAL_PAGE_ID]: INITIAL_JOURNAL_STATE,
    [SCRATCHPAD_ID]: INITIAL_SCRATCHPAD_STATE,
    [CHROME_EXTENSION]: INITIAL_CHROME_EXT_STATE
};
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
        updatePageContents(state, action: PayloadAction<{ pageId: string, title: string, body: Node[]}>) {
            const newPageState = {...state[action.payload.pageId], title: action.payload.title, body: action.payload.body};
            return { ...state, [action.payload.pageId]: newPageState }
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
        updateScratchpad(state, action: PayloadAction<{body: Node[]}>) {
            const newScratchpadState = {...state[SCRATCHPAD_ID], title: SCRATCHPAD_TITLE, body: action.payload.body};
            return { ...state, [SCRATCHPAD_ID]: newScratchpadState }
        }
    }
});

export const {
    deletePage,
    updatePageContents,
    createPage,
    updatePageTitle,
    setJournalEntries,
    updateJournalEntry,
    updateJournalEntries,
    updateScratchpad
} = wikiPageSlice.actions;
export default wikiPageSlice.reducer;