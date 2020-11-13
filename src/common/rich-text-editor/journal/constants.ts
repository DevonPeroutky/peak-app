import {
    ELEMENT_BLOCKQUOTE,
    ELEMENT_CODE_BLOCK, ELEMENT_PARAGRAPH,
    ExitBreakPlugin,
    SlateDocument,
    withInlineVoid, withTrailingNode
} from "@udecode/slate-plugins";
import {baseNormalizers, newBasePlugins} from "../defaults";
import {withEditableJournalEntry} from "../plugins/journal-entry-plugin/withEditableJournalEntry";
import {CALLOUT, HEADER_TYPES, JOURNAL_ENTRY, JOURNAL_ENTRY_HEADER, TITLE} from "../constants";
import {JournalEntry} from "../../../redux/wikiPageSlice";
import {getCurrentFormattedDate} from "../../../utils/time";

export const journalPlugins = [
    ...newBasePlugins,
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
];
export const journalNormalizers = [
    ...baseNormalizers,
    withEditableJournalEntry,
    withInlineVoid({ plugins: journalPlugins, voidTypes: [ELEMENT_CODE_BLOCK, JOURNAL_ENTRY_HEADER] }),
    withTrailingNode({ type: ELEMENT_PARAGRAPH, level: 2 }),
] as const;

export const JOURNAL_PAGE_ID = "journal"
export const EMPTY_JOURNAL_STATE: JournalEntry[] = [{
    entry_date: getCurrentFormattedDate(),
    body: [{children: [{text: ""}]}],
}]

export const EMPTY_NODE = [{ type: "p", children: [{text: ""}]}]
