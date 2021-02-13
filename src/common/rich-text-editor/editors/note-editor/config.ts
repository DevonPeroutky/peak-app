import {
    ELEMENT_CODE_BLOCK,
    SlatePlugin,
    withInlineVoid,
} from "@udecode/slate-plugins";
import {
    setEditorNormalizers,
    setEditorPlugins,
} from "../../base_config";

// Default
export const NOTE_NODE_LEVEL: number = 1
export const notePlugins: SlatePlugin[] = setEditorPlugins(NOTE_NODE_LEVEL, [])
export const noteNormalizers = setEditorNormalizers(NOTE_NODE_LEVEL, [
    withInlineVoid({ plugins: notePlugins, voidTypes: [ELEMENT_CODE_BLOCK] })
])
