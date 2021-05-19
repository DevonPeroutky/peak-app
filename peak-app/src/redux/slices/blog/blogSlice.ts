import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {BlogConfiguration} from "./types";
import {createBlogRequest} from "../../../client/blog";
import {store} from "../../store";
import {sleep} from "../../../chrome-extension/utils/generalUtil";

export const blogSlice = createSlice({
    name: 'tags',
    initialState: null,
    reducers: {
        addBlog(state, action: PayloadAction<BlogConfiguration>) {
            return action.payload
        },
        setBlogConfiguration(state, action: PayloadAction<BlogConfiguration>) {
            return {...state, ...action.payload}
        }
    }
});

export const createBlog = (userId: string, blog_payload: BlogConfiguration): Promise<BlogConfiguration> => {
    return createBlogRequest(userId, blog_payload).then(res => {
        return sleep(1000).then(_ => {
            store.dispatch(addBlog(res.data))
            return res.data
        })
    })
}

const { addBlog } = blogSlice.actions;
export default blogSlice.reducer;
