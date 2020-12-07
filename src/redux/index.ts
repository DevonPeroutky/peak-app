import {PeakTopic} from "./topicSlice";
import {Peaker} from "./userSlice";
import {FutureRead} from "./readingListSlice";
import {JournalEntry, PeakWikiState} from "./wikiPageSlice";
import {QuickSwitcherState} from "./quickSwitcherSlice";
import {ElectronState} from "./electronSlice";
import {PeakTag} from "./tagSlice";

export interface AppState {
    topics: PeakTopic[],
    user: Peaker,
    futureReads: FutureRead[],
    peakWikiState: PeakWikiState,
    quickSwitcher: QuickSwitcherState
    journal: boolean,
    electron: ElectronState,
    tags: PeakTag[]
}