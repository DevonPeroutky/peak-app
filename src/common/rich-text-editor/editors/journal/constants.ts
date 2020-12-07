import {
    ELEMENT_CODE_BLOCK,
    SlatePlugin,
    withInlineVoid,
} from "@udecode/slate-plugins";
import {
    setEditorPlugins,
    setEditorNormalizers
} from "../../defaults";
import {withEditableJournalEntry} from "../../plugins/journal-entry-plugin/withEditableJournalEntry";
import {JOURNAL_ENTRY_HEADER} from "../../types";
import {JournalEntry} from "../../../../redux/wikiPageSlice";
import {JournalEntryPlugin} from "../../plugins/journal-entry-plugin/JournalEntryPlugin";
import {getCurrentFormattedDate} from "../../../../utils/time";

export const JOURNAL_PAGE_ID = "journal"
export const EMPTY_JOURNAL_STATE: JournalEntry[] = [{
    entry_date: getCurrentFormattedDate(),
    body: [{children: [{text: ""}]}],
}]

// Because we have JournalEntry --> Node[] per JournalEntry, the editor 'depth' is 2 deep instead of the default of 1.
export const JOURNAL_NODE_LEVEL: number = 2
export const journalPlugins: SlatePlugin[] = setEditorPlugins(JOURNAL_NODE_LEVEL, [JournalEntryPlugin()])
export const journalNormalizers = setEditorNormalizers(JOURNAL_NODE_LEVEL, [
    withEditableJournalEntry,
    withInlineVoid({ plugins: journalPlugins, voidTypes: [ELEMENT_CODE_BLOCK, JOURNAL_ENTRY_HEADER] })
])
