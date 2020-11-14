import {PeakTitlePlugin} from "../plugins/peak-title-plugin/PeakTitlePlugin";
import {
    ELEMENT_BLOCKQUOTE,
    ELEMENT_CODE_BLOCK,
    ELEMENT_PARAGRAPH,
    ExitBreakPlugin,
    SlatePlugin,
    withInlineVoid,
    withNormalizeTypes,
    withTrailingNode
} from "@udecode/slate-plugins";
import {CALLOUT, HEADER_TYPES, JOURNAL_ENTRY, JOURNAL_ENTRY_HEADER, TITLE} from "../constants";
import {
    defaultOptions, DraggableNodeConfig, setEditorNormalizers, setEditorPlugins,
} from "../defaults";

const wikiSpecificDragConfig: DraggableNodeConfig[] = [{ ...defaultOptions.p, level: 1 }]
const wikiSpecificPlugins: SlatePlugin[] = [
    PeakTitlePlugin(),
    ExitBreakPlugin({
        rules: [
            {
                hotkey: 'mod+enter',
                query: {
                    allow: [ELEMENT_BLOCKQUOTE, CALLOUT],
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
export const wikiPlugins: SlatePlugin[] = setEditorPlugins(wikiSpecificDragConfig, wikiSpecificPlugins)
export const wikiNormalizers = setEditorNormalizers(wikiSpecificDragConfig, [
    withNormalizeTypes({
        rules: [{ path: [0, 0], strictType: TITLE }],
    }),
    withInlineVoid({ plugins: wikiPlugins, voidTypes: [ELEMENT_CODE_BLOCK, JOURNAL_ENTRY_HEADER] }),
    withTrailingNode({ type: ELEMENT_PARAGRAPH, level: 1 })
])
