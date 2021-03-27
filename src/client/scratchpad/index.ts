import { updateScratchpad } from "src/redux/slices/wikiPageSlice";
import {updateScratchpadRequest} from "./client";
import { Node } from "slate";
import {useCallback} from "react";
import {debounce} from "lodash";
import {store} from "../../redux/store";
import {endSavingPage} from "../../redux/slices/activeEditor/activeEditorSlice";

function updateScratchPad(userId: string, body: Node[], scratchpadId: string) {
    return updateScratchpadRequest(userId, body, scratchpadId).then(res => {
        console.log(`Res `, res)
        store.dispatch(updateScratchpad({ body: body } ))
        store.dispatch(endSavingPage())
    })
}
export function useDebouncePeakScratchpadSaver() {

    // You need useCallback otherwise it's a different function signature each render?
    // const updateNoteAndStub = (user: Peaker, note: PeakNote, newNote: UpdateNotePayload) => {
    //     return updatePeakNote(user.id, note.id, newNote)
    // }
    return useCallback(debounce(updateScratchPad, 1500), [])
}
