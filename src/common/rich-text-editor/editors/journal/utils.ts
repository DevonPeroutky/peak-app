import {Node} from "slate";
import {JOURNAL_ENTRY, JOURNAL_ENTRY_HEADER} from "../../types";
import {JournalEntry} from "./types";

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
    // @ts-ignore
    return {
        userId: userId,
        entry_date: journalEntrySlateNode.entry_date,
        body: journalEntrySlateNode.children,
    } as JournalEntry
}
