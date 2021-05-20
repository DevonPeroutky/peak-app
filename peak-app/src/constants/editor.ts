import {CHROME_EXTENSION} from "../common/rich-text-editor/editors/chrome-extension/constants";
import {PeakEditorState, PeakHyperlinkState, PeakWikiPage} from "./wiki-types";
import {EMPTY_PARAGRAPH_NODE} from "../common/rich-text-editor/editors/constants";

export const INITIAL_LINK_STATE: PeakHyperlinkState = {
    currentLinkUrl: '',
    currentSelection: null,
    currentHyperLinkId: '',
    currentText: ''
};

export const INITIAL_EDITING_STATE: PeakEditorState = {
    isEditing: true,
    isSaving: false,
    focusMap: {},
    showLinkMenu: false,
    currentLinkState: INITIAL_LINK_STATE,
};

export const INITIAL_PAGE_STATE: PeakWikiPage = {
    id: "-1",
    body: [
        {
            children: [
                EMPTY_PARAGRAPH_NODE()
            ],
        }
    ],
    title: ''
};

export const INITIAL_CHROME_EXT_STATE: PeakWikiPage = {...INITIAL_PAGE_STATE, id: CHROME_EXTENSION }
