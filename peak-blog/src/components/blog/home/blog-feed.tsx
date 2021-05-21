import {PeakPost} from "component-library";
import React from "react";
import {Post} from "../post/post";

export const BlogFeed = (props: { posts: PeakPost[] }) => {
    const { posts } = props

    return (posts.map(post => <Post key={post.id} post={post}/>))
}