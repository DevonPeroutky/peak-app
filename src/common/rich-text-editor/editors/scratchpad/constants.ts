import {PeakWikiPage} from "../../../../constants/wiki-types";
import {INITIAL_PAGE_STATE} from "../../../../constants/editor";

export const SCRATCHPAD_ID = "scratchpad"
export const SCRATCHPAD_TITLE = "scratchpad"

export const INITIAL_SCRATCHPAD_STATE: PeakWikiPage = {...INITIAL_PAGE_STATE, id: SCRATCHPAD_ID, title: SCRATCHPAD_TITLE}
