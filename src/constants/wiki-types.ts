import {Node} from "slate";
import {JournalEntry} from "../common/rich-text-editor/editors/journal/types";
import {Range} from "slate/dist/interfaces/range";

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
    isSaving: boolean
};
export interface PeakWikiPage {
    id: string,
    inserted_at?: Date,
    body: Node[] | JournalEntry[], // Should probably be Node[] or better yet --> SlateDocument
    title: string,
}

export interface ScratchPad {
    id: string,
    inserted_at?: Date,
    body: Node[],
    title: string,
}

export interface PeakWikiState {
    [key: string]: PeakWikiPage | ScratchPad;
}

