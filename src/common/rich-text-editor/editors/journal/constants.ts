import {JournalEntry} from "../../../../redux/slices/wikiPageSlice";
import {getCurrentFormattedDate} from "../../../../utils/time";

export const EMPTY_JOURNAL_STATE: JournalEntry[] = [{
    id: "initial-journal-placeholder-node. This should never be in Redux or Postgres",
    entry_date: getCurrentFormattedDate(),
    body: [{children: [{text: ""}]}],
}]
