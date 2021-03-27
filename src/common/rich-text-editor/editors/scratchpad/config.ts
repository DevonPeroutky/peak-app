import {SlatePlugin, withInlineVoid} from "@udecode/slate-plugins";
import { setEditorNormalizers, setEditorPlugins } from "../../base_config";
import {PEAK_VOID_TYPES} from "../../types";

// Default
export const SCRATCHPAD_NODE_LEVEL: number = 1
export const scratchpadPlugins: SlatePlugin[] = setEditorPlugins(SCRATCHPAD_NODE_LEVEL, [])
export const scratchpadNormalizers = setEditorNormalizers(SCRATCHPAD_NODE_LEVEL, [
    withInlineVoid({ plugins: scratchpadPlugins, voidTypes: PEAK_VOID_TYPES })
])
