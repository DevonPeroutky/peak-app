import {getCurrentFormattedDate} from "./time";
import {JournalEntry} from "../common/rich-text-editor/editors/journal/types";

export function getTodayEntry(journal: JournalEntry[]) {
    console.log(`JOURNAL ENTRIES `, journal)
    const today = getCurrentFormattedDate()
    return journal.find(je => je.entry_date === today)
}
