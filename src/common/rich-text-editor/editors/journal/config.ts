import {
    ELEMENT_CODE_BLOCK,
    SlatePlugin,
    withInlineVoid,
} from "@udecode/slate-plugins";
import {
    setEditorPlugins,
    setEditorNormalizers
} from "../../base_config";
import {withEditableJournalEntry} from "../../plugins/journal-entry-plugin/withEditableJournalEntry";
import {JOURNAL_ENTRY_HEADER} from "../../types";
import {JournalEntryPlugin} from "../../plugins/journal-entry-plugin/JournalEntryPlugin";


// Because we have JournalEntry --> Node[] per JournalEntry, the editor 'depth' is 2 deep instead of the default of 1.
export const JOURNAL_NODE_LEVEL: number = 2
const journalEntryPlugin: SlatePlugin = JournalEntryPlugin()
export const journalPlugins: SlatePlugin[] = setEditorPlugins(JOURNAL_NODE_LEVEL, [journalEntryPlugin], true)
export const journalNormalizers = setEditorNormalizers(JOURNAL_NODE_LEVEL, [
    withEditableJournalEntry,
    withInlineVoid({ plugins: journalPlugins, voidTypes: [ELEMENT_CODE_BLOCK, JOURNAL_ENTRY_HEADER] })
], true)