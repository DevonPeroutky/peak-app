import {
    SlatePlugin,
    withInlineVoid,
} from "@udecode/slate-plugins";
import {
    setEditorNormalizers,
    setEditorPlugins,
} from "../../base_config";
import {PEAK_VOID_TYPES} from "../../types";

// Default
export const NOTE_NODE_LEVEL: number = 1
export const notePlugins: SlatePlugin[] = setEditorPlugins(NOTE_NODE_LEVEL, [])
export const noteNormalizers = setEditorNormalizers(NOTE_NODE_LEVEL, [
    withInlineVoid({ plugins: notePlugins, voidTypes: PEAK_VOID_TYPES })
])
