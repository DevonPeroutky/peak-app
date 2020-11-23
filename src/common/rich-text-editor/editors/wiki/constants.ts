import {PeakTitlePlugin} from "../../plugins/peak-title-plugin/PeakTitlePlugin";
import {
    ELEMENT_BLOCKQUOTE,
    ELEMENT_CODE_BLOCK,
    ExitBreakPlugin,
    SlatePlugin,
    withInlineVoid,
    withNormalizeTypes
} from "@udecode/slate-plugins";
import {HEADER_TYPES, JOURNAL_ENTRY_HEADER, TITLE} from "../../types";
import {
    setEditorNormalizers, setEditorPlugins,
} from "../../defaults";
import {PEAK_CALLOUT} from "../../plugins/peak-callout-plugin/defaults";

const wikiSpecificPlugins: SlatePlugin[] = [
    PeakTitlePlugin(),
]
// Default
const nodeLevel: number = 1
export const wikiPlugins: SlatePlugin[] = setEditorPlugins(nodeLevel, wikiSpecificPlugins)
export const wikiNormalizers = setEditorNormalizers(nodeLevel, [
    withNormalizeTypes({
        rules: [{ path: [0, 0], strictType: TITLE }],
    }),
    withInlineVoid({ plugins: wikiPlugins, voidTypes: [ELEMENT_CODE_BLOCK, JOURNAL_ENTRY_HEADER] })
])
