import {BlogConfiguration} from "./configuration/BlogConfiguration";
import {BlogSetup} from "./setup/BlogSetup";
import React, {useState} from "react";

export const BlogHome = (props: {}) => {
    const isBlogSetup = false

    if (isBlogSetup) {
        return <BlogConfiguration/>
    } else {
        return <BlogSetup/>
    }
}