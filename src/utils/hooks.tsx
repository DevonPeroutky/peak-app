import {useLocation} from "react-router-dom";
import {message, notification} from "antd";
import {batch, useDispatch, useSelector} from "react-redux";
import {AppState} from "../redux";
import { setUserHierarchy} from "../redux/slices/user/userSlice";
import {
    updatePageContents,
    updateJournalEntry,
    setJournalEntries,
    updateJournalEntries,
    journalOrdering,
    updatePageTitle
} from "../redux/slices/wikiPageSlice";
import {Node} from "slate";
import {EXISTING_PEAK_USER_ID} from "../constants/constants";
import peakAxiosClient from "../client/axiosConfig"
import { debounce } from "lodash";
import {useCallback, useEffect, useState} from 'react';
import {isEmpty} from "ramda";
import {PeakPage, PeakTopic, updatePageTitleInSidebar, updateTopic} from "../redux/slices/topicSlice";
import {useUpdatePageInHierarchy} from "./hierarchy";
import {getCurrentFormattedDate} from "./time";
import {updatePage} from "./requests";
import {useQuery} from "./urls";
import {FutureRead} from "../redux/slices/readingListSlice";
import {CHROME_EXTENSION} from "../common/rich-text-editor/editors/chrome-extension/constants";
import {PeakWikiPage, PeakWikiState} from "../constants/wiki-types";
import {JOURNAL_PAGE_ID} from "../common/rich-text-editor/editors/journal/constants";
import {JournalEntry} from "../common/rich-text-editor/editors/journal/types";
import {Peaker} from "../types";
import {PeakTopicNode} from "../redux/slices/user/types";
import {endSavingPage, setEditing, useActiveEditorState} from "../redux/slices/activeEditor/activeEditorSlice";
const R = require('ramda');

// --------------------------------------------------
// Fetching from Redux
// --------------------------------------------------
export function useOnlineStatus() {
    return useSelector<AppState, boolean>(state => state.electron.isOnline);
}

export function useJournal() {
    return useSelector<AppState, PeakWikiPage>(state => state.peakWikiState[JOURNAL_PAGE_ID]);
}

export function useChromeExtEditorState() {
    return useSelector<AppState, PeakWikiPage>(state => state.peakWikiState[CHROME_EXTENSION]);
}

export function useCurrentUser() {
    return useSelector<AppState, Peaker>(state => state.currentUser);
}

export function useFutureReads() {
    return useSelector<AppState, FutureRead[]>(state => state.futureReads);
}

export function useIsContextElectron() {
    const query = useQuery();
    const desktopLoginParam: string | null = query.get("desktop-login")
    return desktopLoginParam != null && desktopLoginParam == "true"
}

export function useLinkedUserId() {
    const query = useQuery();
    const linkedUserId: string | null = query.get(EXISTING_PEAK_USER_ID)
    return linkedUserId
}

export function useTopics() {
    return useSelector<AppState, PeakTopic[]>(state => state.topics);
}

export function useCurrentTopic(topicId: string) {
    return useSelector<AppState, PeakTopic>(state => state.topics.find(t => t.id === topicId)!);
}

export function useIsFullscreen() {
    return useSelector<AppState, boolean>(state => state.electron.isFullscreen);
}

// export function useJournalEditingState() {
//     const peakWikiState: PeakWikiState = useSelector<AppState, PeakWikiState>(state => state.peakWikiState);
// }

/**
 * Use this for getting the current page location
 */
export function useCurrentPageId() {
    const location = useLocation();

    // TODO: HANDLE JOURNAL
    const url = location.pathname.split("/");
    const currentPageId = url.pop()!;
    return currentPageId
}

/**
 * Use this for getting the current wiki page. Do not use this externally for just getting the page id, as this will come
 * back null for pages that are not wiki Pages.
 */
export function useCurrentWikiPage() {
    const currentPageId = useCurrentPageId();
    const peakWikiState: PeakWikiState = useSelector<AppState, PeakWikiState>(state => state.peakWikiState);
    return peakWikiState[currentPageId];
}

// --------------------------------------------------
// General Purpose
// --------------------------------------------------
export function useKeyPress(targetKey: string) {
    // State for keeping track of whether key is pressed
    const [keyPressed, setKeyPressed] = useState(false);

    // If pressed key is our target key then set to true

    // @ts-ignore
    function downHandler({ key }) {
        if (key === targetKey) {
            setKeyPressed(true);
        }
    }

    // If released key is our target key then set to false
    // @ts-ignore
    const upHandler = ({ key }) => {
        if (key === targetKey) {
            setKeyPressed(false);
        }
    };

    // Add event listeners
    useEffect(() => {
        window.addEventListener('keydown', downHandler);
        window.addEventListener('keyup', upHandler);
        // Remove event listeners on cleanup
        return () => {
            window.removeEventListener('keydown', downHandler);
            window.removeEventListener('keyup', upHandler);
        };
    }, []); // Empty array ensures that effect is only run on mount and unmount

    return keyPressed;
}

export const useDetermineNextLink = () => {
    const topics = useTopics()

    return (pageId: string) => {
        const allPages: PeakPage[] = topics.flatMap(t => t.pages);
        const pageIndex = allPages.findIndex(p => p.id === pageId);

        if (pageIndex < 1) {
            return `/home/journal`
        } else {
            const newPage: PeakPage = allPages[pageIndex - 1];
            const topic = topics.find(t => t.pages.find(p => p.id === newPage.id) !== undefined)!;
            return `/topic/${topic.id}/wiki/${newPage.id}`;
        }
    }
};


// --------------------------------------------------
// Publish Page Updates
// --------------------------------------------------
export function usePagePublisher() {
    const dispatch = useDispatch();
    const currentWikiPage = useCurrentWikiPage();
    return () => {
        dispatch(setEditing({ pageId: currentWikiPage.id, isEditing: false }));
        notification.success({ message: "Published", duration: 1});
    }
}

export function useSavePageRequest() {
    const user: Peaker = useSelector<AppState, Peaker>(state => state.currentUser);
    const topics: PeakTopic[] = useTopics()
    const deriveNewHierarchy = useUpdatePageInHierarchy()

    return (newValue: Node[], pageTitle: string, pageId: string) => {
        const currentTopic: PeakTopic = topics.find(t => t.pages.map(p => p.id).includes(pageId))!
        const newHierarchy = deriveNewHierarchy(newValue, currentTopic.id, pageId)
        return updatePage(user.id, pageId, {body: newValue, title: pageTitle}, newHierarchy)
    }
}

function usePageSaver() {
    const dispatch = useDispatch();
    const savePage = useSavePageRequest()
    const editorState = useActiveEditorState()

    return (newValue: Node[], pageTitle: string, pageId: string) => {
        if (!isEmpty(editorState.focusMap)) {
            console.log("NOT SUBMITTING")
            // @ts-ignore
            return
        }

        return savePage(newValue, pageTitle, pageId)
            .then((res) => {
                const newHierarchy: PeakTopicNode[] = res.data.hierarchy
                const newPage: PeakWikiPage = res.data.page
                batch(() => {
                    dispatch(endSavingPage({pageId: pageId}))
                    dispatch(setUserHierarchy(newHierarchy))
                    dispatch(updatePageContents({
                        pageId: pageId,
                        body: newPage.body as Node[],
                        title: newPage.title
                    }));
                })
            }).catch((err) => {
                console.log(err)
                notification.error({message: "Failed to save the page. Please try again or let Devon know it failed"})
            })
    }
}

export function useDebounceWikiSaver() {
    const savePage = usePageSaver();

    // You need useCallback otherwise it's a different function signature each render?
    return useCallback(debounce(savePage, 1500), [])
}

// --------------------------------------------------
// Journal Requests
// --------------------------------------------------
function useSaveJournalEntryRequest() {
    const user: Peaker = useSelector<AppState, Peaker>(state => state.currentUser);

    return (date: string, newValue: Node[]) => {
        return peakAxiosClient.put(`/api/v1/users/${user.id}/journal?date=${date}`, {
            "journal-entry": {
                body: newValue,
            }
        })
    }
}

function useBulkSaveJournalEntryRequest() {

    return (entries: JournalEntry[], user: Peaker) => {
        console.log(`The current user is ${user.email} --> ${user.id}`)
        return peakAxiosClient.post(`/api/v1/users/${user.id}/bulk-update-journal`, {
            "journal_entries": entries
        })
    }
}

export function useJournalSaver() {
    const dispatch = useDispatch();
    const saveJournalEntry = useSaveJournalEntryRequest()

    return (date: string, newValue: Node[]) => {

        return saveJournalEntry(date, newValue)
            .then((res) => {
                const newJournalEntry: JournalEntry = res.data.journal
                batch(() => {
                    dispatch(updateJournalEntry(newJournalEntry));
                })
            }).catch((err) => {
                console.log(err)
                notification.error({message: "Failed to save the page. Please try again or let Devon know it failed"})
            })
    }
}

function useBulkJournalEntrySaver() {
    const dispatch = useDispatch();
    const bulkSaveJournalEntry = useBulkSaveJournalEntryRequest()
    return (entries: JournalEntry[], user: Peaker) => {
        return bulkSaveJournalEntry(entries, user)
            .then((res) => {
                const updatedJournalEntries: JournalEntry[] = res.data.journal_entries
                batch(() => {
                    dispatch(updateJournalEntries(updatedJournalEntries));
                })
            }).catch((err) => {
                console.log(err)
                notification.error({message: "Failed to save the page. Please try again or let Devon know it failed"})
            })
    }

}

export function useDebounceBulkJournalEntrySaver() {
    const bulkSaveJournalEntries = useBulkJournalEntrySaver()

    // You need useCallback otherwise it's a different function signature each render?
    return useCallback(debounce(bulkSaveJournalEntries, 1000), [])
}

export function useFetchJournal() {
    const dispatch = useDispatch()
    const user: Peaker = useSelector<AppState, Peaker>(state => state.currentUser);

    return (readOnly: boolean, date?: string | undefined, amount: number = 30) => {
        const searchDate = date ?? getCurrentFormattedDate()
        return peakAxiosClient
            .get(`/api/v1/users/${user.id}/journal-entries?entry_date=${searchDate}&read_only=${readOnly}&amount=${amount}`)
            .then(res => {
                console.log(`JOURNAL ENTRIES RES`, res.data.journal_entries)
                const sortedJournal: JournalEntry[] = R.sort(journalOrdering, res.data.journal_entries)
                console.log(`Sorted Journal`, sortedJournal)
                dispatch(setJournalEntries(sortedJournal))
                return sortedJournal
            }).catch(err => {
                message.error({
                    content: 'Failed to fetch your Journal! Tell Devon he sucks at the whole "Programming" thing',
                    key: 1
                })
            })
    }
}


const useUpdatePageTitleEverywhere = () => {
    const dispatch = useDispatch()
    return (currentWikiPageId: string, newTitle: string) => {
        dispatch(updatePageTitle({ pageId: currentWikiPageId, title: newTitle }));
        dispatch(updatePageTitleInSidebar({ pageId: currentWikiPageId, newTitle: newTitle }));
    }
};

export function useDebouncePageTitleUpdater() {
    const updatePageTitle = useUpdatePageTitleEverywhere();

    // You need useCallback otherwise it's a different function signature each render?
    return useCallback(debounce(updatePageTitle, 1000), [])
}
