import {PeakTopic} from "./topicSlice";
import {Peaker} from "./userSlice";
import {FutureRead} from "./readingListSlice";
import {PeakWikiState} from "./wikiPageSlice";
import {QuickSwitcherState} from "./quickSwitcherSlice";
import {ElectronState} from "./electronSlice";
import {PeakTag} from "./tagSlice";
import {DisplayPeaker} from "./userAccountsSlice";

export const GLOBAL_APP_KEYS = ["electron", "quickSwitcher", "userAccounts"]

export interface AppState {
    topics: PeakTopic[],
    currentUser: Peaker,
    userAccounts: DisplayPeaker[],
    futureReads: FutureRead[],
    peakWikiState: PeakWikiState,
    quickSwitcher: QuickSwitcherState
    electron: ElectronState,
    tags: PeakTag[]
}