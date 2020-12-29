import { ELEMENT_CODE_BLOCK, SlatePlugin, withInlineVoid } from "@udecode/slate-plugins";
import { setEditorNormalizers, setEditorPlugins } from "../../defaults";

// Default
const nodeLevel: number = 1
export const chromeExtensionPlugins: SlatePlugin[] = setEditorPlugins(nodeLevel)
export const chromeExtensionNormalizers = setEditorNormalizers(nodeLevel, [
    withInlineVoid({ plugins: chromeExtensionPlugins, voidTypes: [ELEMENT_CODE_BLOCK] })
])
