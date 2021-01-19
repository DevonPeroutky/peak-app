import {ELEMENT_PARAGRAPH} from "@udecode/slate-plugins";
import {EMPTY_JOURNAL_STATE, JOURNAL_PAGE_ID} from "../common/rich-text-editor/editors/journal/constants";
import {CHROME_EXTENSION} from "../common/rich-text-editor/editors/chrome-extension/constants";
import {PeakEditorState, PeakHyperlinkState, PeakWikiPage} from "./wiki-types";

export const INITIAL_LINK_STATE: PeakHyperlinkState = {
    currentLinkUrl: '',
    currentSelection: null,
    currentHyperLinkId: '',
    currentText: ''
};

export const INITIAL_EDITING_STATE: PeakEditorState = {
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
            children: [{ type: ELEMENT_PARAGRAPH, children: [{ text: ''}], id: 4}],
        }
    ],
    title: '',
    isSaving: false
};

export const INITIAL_JOURNAL_STATE: PeakWikiPage = {...INITIAL_PAGE_STATE, body: EMPTY_JOURNAL_STATE, id: JOURNAL_PAGE_ID }
export const INITIAL_CHROME_EXT_STATE: PeakWikiPage = {...INITIAL_PAGE_STATE, id: CHROME_EXTENSION }
