import {BlogSetup} from "./setup/BlogSetup";
import React, {useState} from "react";
import {BlogSettings} from "./settings/BlogConfiguration";
import {BlogConfiguration} from "../../redux/slices/blog/types";
import {useBlog} from "../../redux/slices/blog/hooks";

export const BlogHome = (props: {}) => {
    const isBlogSetup: BlogConfiguration | null = useBlog()

    console.log(`IS BLOG SEETUP `, isBlogSetup)

    if (isBlogSetup) {
        return <BlogSettings/>
    } else {
        return <BlogSetup/>
    }
}