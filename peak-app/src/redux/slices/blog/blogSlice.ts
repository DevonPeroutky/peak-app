import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {BlogConfiguration} from "./types";
import {createBlogRequest, updateBlogConfigurationRequest} from "../../../client/blog";
import {store} from "../../store";
import {sleep} from "../../../chrome-extension/utils/generalUtil";

export const blogSlice = createSlice({
    name: 'blog',
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
        store.dispatch(addBlog(res.data))
        return res.data
    })
}

export const updateBlogConfiguration = (userId: string, blog_payload: BlogConfiguration): Promise<BlogConfiguration> => {
    return updateBlogConfigurationRequest(userId, blog_payload).then(res => {
        store.dispatch(setBlogConfiguration(res.data))
        return res.data
    })
}

const { addBlog, setBlogConfiguration } = blogSlice.actions;
export default blogSlice.reducer;
