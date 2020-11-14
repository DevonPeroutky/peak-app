import {
    ELEMENT_BLOCKQUOTE,
    ELEMENT_CODE_BLOCK,
    ELEMENT_PARAGRAPH,
    ExitBreakPlugin,
    SlatePlugin,
    withInlineVoid,
    withTrailingNode
} from "@udecode/slate-plugins";
import {
    setEditorPlugins,
    defaultOptions, setEditorNormalizers, DraggableNodeConfig,
} from "../defaults";
import {withEditableJournalEntry} from "../plugins/journal-entry-plugin/withEditableJournalEntry";
import {CALLOUT, HEADER_TYPES, JOURNAL_ENTRY, JOURNAL_ENTRY_HEADER, TITLE} from "../constants";
import {JournalEntry} from "../../../redux/wikiPageSlice";
import {getCurrentFormattedDate} from "../../../utils/time";

export const JOURNAL_PAGE_ID = "journal"
export const EMPTY_NODE = [{ type: "p", children: [{text: ""}]}]
// TODO: SHOULD THE BODY BE EMPTY_NODE?!?!?
export const EMPTY_JOURNAL_STATE: JournalEntry[] = [{
    entry_date: getCurrentFormattedDate(),
    body: [{children: [{text: ""}]}],
}]


const journalSpecificDragConfig: DraggableNodeConfig[] = [{ ...defaultOptions.p, level: 2 }]
const journalSpecificPlugins: SlatePlugin[] = [
    ExitBreakPlugin({
        rules: [
            {
                hotkey: 'mod+enter',
                query: {
                    allow: [ELEMENT_BLOCKQUOTE, CALLOUT],
                },
                level: 2
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
export const journalPlugins: SlatePlugin[] = setEditorPlugins(journalSpecificDragConfig, journalSpecificPlugins)
export const journalNormalizers = setEditorNormalizers(journalSpecificDragConfig, [withEditableJournalEntry, withInlineVoid({ plugins: journalPlugins, voidTypes: [ELEMENT_CODE_BLOCK, JOURNAL_ENTRY_HEADER] }), withTrailingNode({ type: ELEMENT_PARAGRAPH, level: 2 })])
