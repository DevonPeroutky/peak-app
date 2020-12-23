import {PeakTopic} from "./slices/topicSlice";
import {Peaker} from "./slices/userSlice";
import {FutureRead} from "./slices/readingListSlice";
import {PeakWikiState} from "./slices/wikiPageSlice";
import {QuickSwitcherState} from "./slices/quickSwitcherSlice";
import {ElectronState} from "./slices/electronSlice";
import {PeakTag} from "./slices/tagSlice";
import {DisplayPeaker} from "./slices/userAccountsSlice";
import {PeakBook} from "./slices/booksSlice";

export const GLOBAL_APP_KEYS = ["electron", "quickSwitcher", "userAccounts"]

export interface AppState {
    topics: PeakTopic[],
    currentUser: Peaker,
    userAccounts: DisplayPeaker[],
    futureReads: FutureRead[],
    peakWikiState: PeakWikiState,
    quickSwitcher: QuickSwitcherState
    electron: ElectronState,
    tags: PeakTag[],
    books: PeakBook[]
}