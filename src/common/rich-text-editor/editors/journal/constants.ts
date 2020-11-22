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
import {getCurrentFormattedDate} from "../../../../utils/time";
import {JournalEntryPlugin} from "../../plugins/journal-entry-plugin/JournalEntryPlugin";

export const JOURNAL_PAGE_ID = "journal"
export const EMPTY_JOURNAL_STATE: JournalEntry[] = [{
    entry_date: getCurrentFormattedDate(),
    body: [{children: [{text: ""}]}],
}]

// Because we have JournalEntry --> Node[] per JournalEntry, the editor 'depth' is 2 deep instead of the default of 1.
const nodeLevel: number = 2
export const journalPlugins: SlatePlugin[] = setEditorPlugins(nodeLevel, [JournalEntryPlugin()])
export const journalNormalizers = setEditorNormalizers(nodeLevel, [
    withEditableJournalEntry,
    withInlineVoid({ plugins: journalPlugins, voidTypes: [ELEMENT_CODE_BLOCK, JOURNAL_ENTRY_HEADER] })
])
