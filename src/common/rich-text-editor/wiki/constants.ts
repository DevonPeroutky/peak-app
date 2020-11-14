import {PeakTitlePlugin} from "../plugins/peak-title-plugin/PeakTitlePlugin";
import {
    ELEMENT_BLOCKQUOTE,
    ELEMENT_CODE_BLOCK,
    ExitBreakPlugin,
    SlatePlugin,
    withInlineVoid,
    withNormalizeTypes
} from "@udecode/slate-plugins";
import {HEADER_TYPES, JOURNAL_ENTRY_HEADER, TITLE} from "../constants";
import {
    setEditorNormalizers, setEditorPlugins,
} from "../defaults";
import {PEAK_CALLOUT} from "../plugins/peak-callout-plugin/defaults";

const wikiSpecificPlugins: SlatePlugin[] = [
    PeakTitlePlugin(),
    ExitBreakPlugin({
        rules: [
            {
                hotkey: 'mod+enter',
                query: {
                    allow: [ELEMENT_BLOCKQUOTE, PEAK_CALLOUT],
                },
            },
            {
                hotkey: 'mod+shift+enter',
                before: true,
            },
            {
                hotkey: 'enter',
                query: {
                    allow: [...HEADER_TYPES, TITLE],
                },
            },
        ],
    })

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
