import {SlatePlugin, withInlineVoid} from "@udecode/slate-plugins";
import { setEditorNormalizers, setEditorPlugins } from "../../base_config";
import {PeakWikiPage} from "../../../../constants/wiki-types";
import {INITIAL_PAGE_STATE} from "../../../../constants/editor";
import {SCRATCHPAD_ID, SCRATCHPAD_TITLE} from "./constants";
import {PEAK_VOID_TYPES} from "../../types";

// Default
export const SCRATCHPAD_NODE_LEVEL: number = 1
export const scratchpadPlugins: SlatePlugin[] = setEditorPlugins(SCRATCHPAD_NODE_LEVEL, [])
export const scratchpadNormalizers = setEditorNormalizers(SCRATCHPAD_NODE_LEVEL, [
    withInlineVoid({ plugins: scratchpadPlugins, voidTypes: PEAK_VOID_TYPES })
])

export const INITIAL_SCRATCHPAD_STATE: PeakWikiPage = {...INITIAL_PAGE_STATE, id: SCRATCHPAD_ID, title: SCRATCHPAD_TITLE}
