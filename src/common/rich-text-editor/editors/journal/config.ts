import {
    SlatePlugin,
    withInlineVoid,
} from "@udecode/slate-plugins";
import {withEditableJournalEntry} from "../../plugins/journal-entry-plugin/withEditableJournalEntry";
import {PEAK_VOID_TYPES} from "../../types";
import {JournalEntryPlugin} from "../../plugins/journal-entry-plugin/JournalEntryPlugin";
import {buildListOfPlugins} from "../../editorFactory";

/** DEPRECATED **/

// Because we have JournalEntry --> Node[] per JournalEntry, the editor 'depth' is 2 deep instead of the default of 1.
// export const JOURNAL_NODE_LEVEL: number = 2
// export const journalPlugins: SlatePlugin[] = setEditorPlugins(JOURNAL_NODE_LEVEL, [JournalEntryPlugin()], true)
// export const journalNormalizers = setEditorNormalizers(JOURNAL_NODE_LEVEL, [
//     withEditableJournalEntry,
//     withInlineVoid({ plugins: journalPlugins, voidTypes: PEAK_VOID_TYPES })
// ], true)
// Unused
export const journalPlugins: SlatePlugin[] = buildListOfPlugins()
