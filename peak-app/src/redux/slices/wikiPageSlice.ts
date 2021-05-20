import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {Node} from "slate";
import {differenceWith, omit, uniqBy} from "ramda";
import {CHROME_EXTENSION} from "../../common/rich-text-editor/editors/chrome-extension/constants";
import {
    INITIAL_CHROME_EXT_STATE,
    INITIAL_PAGE_STATE,
} from "../../constants/editor";
import { PeakWikiPage, PeakWikiState} from "../../constants/wiki-types";
import {SCRATCHPAD_ID, SCRATCHPAD_TITLE} from "../../common/rich-text-editor/editors/scratchpad/constants";
import {INITIAL_SCRATCHPAD_STATE} from "../../common/rich-text-editor/editors/scratchpad/constants";
const R = require('ramda');

export const INITIAL_WIKI_STATE: PeakWikiState = {
    [SCRATCHPAD_ID]: INITIAL_SCRATCHPAD_STATE,
    [CHROME_EXTENSION]: INITIAL_CHROME_EXT_STATE
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
    updateScratchpad
} = wikiPageSlice.actions;
export default wikiPageSlice.reducer;