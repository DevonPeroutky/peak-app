import {PeakTitlePlugin} from "../../plugins/peak-title-plugin/PeakTitlePlugin";
import {
    ELEMENT_CODE_BLOCK,
    SlatePlugin,
    withInlineVoid,
    withNormalizeTypes
} from "@udecode/slate-plugins";
import {TITLE} from "../../types";
import {
    setEditorNormalizers, setEditorPlugins,
} from "../../base_config";

const wikiSpecificPlugins: SlatePlugin[] = [
    PeakTitlePlugin(),
]
// Default
export const WIKI_NODE_LEVEL: number = 1
export const wikiPlugins: SlatePlugin[] = setEditorPlugins(WIKI_NODE_LEVEL, wikiSpecificPlugins)
export const wikiNormalizers = setEditorNormalizers(WIKI_NODE_LEVEL, [
    withNormalizeTypes({
        rules: [{ path: [0, 0], strictType: TITLE }],
    }),
    withInlineVoid({ plugins: wikiPlugins, voidTypes: [ELEMENT_CODE_BLOCK] })
])
