import {PeakTag} from "../../types";
import {Node} from "slate";

export const TAGS_KEY = "tags"
export const ACTIVE_TAB_KEY = "activeTab"

export type ANT_MESSAGE_THEME = "success" | "info" | "warning" | "error"
export enum EDITING_STATE {
    NotEditing,
    Editing,
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
    selectedTags: PeakTag[]
    body?: Node[],
    editingState: EDITING_STATE
}
