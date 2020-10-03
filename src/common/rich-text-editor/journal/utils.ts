import {JournalEntry} from "../../../redux/wikiPageSlice";
import {Node} from "slate";
import {JOURNAL_ENTRY, JOURNAL_ENTRY_HEADER} from "../constants";

export function convertJournalEntryToSlateNodes(journalEntry: JournalEntry): Node[] {
    return [
        {
            type: JOURNAL_ENTRY_HEADER,
            entry_date: journalEntry.entry_date,
            children: [{
                text: ''
            }],
        },
        {
            type: JOURNAL_ENTRY,
            entry_date: journalEntry.entry_date,
            children: journalEntry.body,
        }
    ]
}

export function convertSlateNodeToJournalEntry(journalEntrySlateNode: Node, userId: string): JournalEntry {
    return {
        userId: userId,
        entry_date: journalEntrySlateNode.entry_date,
        body: journalEntrySlateNode.children,
    } as JournalEntry
}
