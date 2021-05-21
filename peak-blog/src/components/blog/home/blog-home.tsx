import {fetch_posts_for_subdomain} from "../../../data/posts/posts";
import {useQuery} from "react-query";
import {PeakPost} from "component-library";
import React from "react";
import {BlogPost} from "../post/post";
import {POSTS_KEY} from "../../../data/posts/types";

export const BlogHome = (props: { subdomain: string }) => {
    const { subdomain } = props
    const { isLoading, isError, status, data, error } = useQuery<PeakPost[], Error>(
        [POSTS_KEY],
        () => fetch_posts_for_subdomain(subdomain),
        {
            staleTime: 600000
        }
    )

    if (isLoading) {
        return <div/>;
    }
    if (isError) {
        return <div>{error!.message}</div>;
    }

    if (data.length === 0) {
        return <div>Coming Soon!</div>
    }

    return (data.map(post => <BlogPost key={post.id} post={post}/>))
}
