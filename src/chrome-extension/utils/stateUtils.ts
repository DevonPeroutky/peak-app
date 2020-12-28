import {loadTagsRequests} from "../../client/tags";
import {PeakTag} from "../../redux/slices/tagSlice";

export function openNoteModal(userId: string) {
    loadTagsRequests(userId).then(res => {
        const returned_tags: PeakTag[] = res.data.tags
        chrome.storage.sync.set({ tags: returned_tags})
    })
    openDrawer()
    // saveToWiki(userId)
}

export function closeDrawer() {
    chrome.storage.sync.set({ visible: false })
}

export function openDrawer() {
    chrome.storage.sync.set({ visible: true })
}
