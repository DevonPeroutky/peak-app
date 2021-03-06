import {PeakTag} from "../../types";
import {Node} from "slate";

export const TAGS_KEY = "tags"
export const ACTIVE_TAB_KEY = "activeTab"

export type ANT_MESSAGE_THEME = "success" | "info" | "warning" | "error"
export enum FOCUS_STATE {
    Focus,
    NotFocused
}
export enum EDITING_STATE {
    NotEditing,
    Editing,
    Deleting,
}
export enum SUBMISSION_STATE {
    Saving,
    Saved,
    MetadataSaved,
}

export interface ActiveTabState {
    tabId: number,
    userId: string,
    pageTitle: string,
    pageUrl: string,
    favIconUrl: string,
    selectedTags: PeakTag[],
    body?: Node[],
    focusState: FOCUS_STATE,
    editingState: EDITING_STATE
}

export enum INJECT_CONTENT_SCRIPT_STATE {
    FAILED,
    INJECTED,
    ALREADY_THERE
}