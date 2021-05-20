import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {store} from "../../store";
import {sleep} from "../../../chrome-extension/utils/generalUtil";
import {PeakPost} from "./types";
import {createPeakPostRequest} from "../../../client/posts";

export const postSlice = createSlice({
    name: 'posts',
    initialState: [] as PeakPost[],
    reducers: {
        addPeakPost(state, action: PayloadAction<PeakPost>) {
            return [...state, action.payload]
        },
        loadBlogPosts(state, action: PayloadAction<PeakPost[]>) {
            return action.payload
        },
    }
});

export const createPeakPost = (userId: string, subdomain: string, post_payload: PeakPost): Promise<PeakPost> => {
    return createPeakPostRequest(userId, subdomain, post_payload).then(res => {
        return sleep(1000).then(_ => {
            store.dispatch(addPeakPost(res.data))
            return res.data
        })
    })
}

const { addPeakPost } = postSlice.actions;
export default postSlice.reducer;
