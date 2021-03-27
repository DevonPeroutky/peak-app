import { SlatePlugin } from "@udecode/slate-plugins";
import { setEditorNormalizers, setEditorPlugins } from "../../base_config";
import {PeakWikiPage} from "../../../../constants/wiki-types";
import {EMPTY_JOURNAL_STATE, JOURNAL_PAGE_ID} from "../journal/constants";
import {INITIAL_PAGE_STATE} from "../../../../constants/editor";
import {EMPTY_PARAGRAPH_NODE} from "../constants";
import {SCRATCHPAD_ID, SCRATCHPAD_TITLE} from "./constants";

// Default
export const scratchpadPlugins: SlatePlugin[] = setEditorPlugins()
export const scratchpadNormalizers = setEditorNormalizers( )

export const INITIAL_SCRATCHPAD_STATE: PeakWikiPage = {...INITIAL_PAGE_STATE, id: SCRATCHPAD_ID, title: SCRATCHPAD_TITLE}
