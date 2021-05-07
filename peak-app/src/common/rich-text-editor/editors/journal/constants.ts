import {getCurrentFormattedDate} from "../../../../utils/time";
import {JournalEntry} from "./types";

export const JOURNAL_PAGE_ID = "journal"
export const JOURNAL_CHANNEL_ID = (userId: string) => `journal:${userId}`

export const EMPTY_JOURNAL_STATE: JournalEntry[] = [{
    id: "initial-journal-placeholder-node. This should never be in Redux or Postgres",
    entry_date: getCurrentFormattedDate(),
    body: [{children: [{text: ""}]}],
}]
