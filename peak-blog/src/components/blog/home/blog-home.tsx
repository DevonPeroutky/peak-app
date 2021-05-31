import {fetch_posts_for_subdomain} from "../../../data/posts/posts";
import {useInfiniteQuery, useQuery, useQueryClient} from "react-query";
import {PeakPost, PeakPostListResponse} from "component-library";
import React from "react";
import {POSTS_KEY} from "../../../data/posts/types";
import {BlogPostPreview} from "../post/post-preview";
import {hasNextPage} from "react-query/types/core/infiniteQueryBehavior";
import useIntersectionObserver from "../../../hooks/useIntersectionObserver";

export const BlogHome = (props: { subdomain: string }) => {
    const { subdomain } = props

    // Move this to satke more advantage of SSR?
    const { isLoading, isError, status, data, fetchNextPage, error } = useInfiniteQuery<PeakPostListResponse, Error>(
        [POSTS_KEY],
        async ({ pageParam = 0 }) => fetch_posts_for_subdomain(subdomain, pageParam),
        {
            staleTime: 600000,
            getPreviousPageParam: firstPage => firstPage.pagination_metadata.cursorBefore ?? false,
            getNextPageParam: lastPage => lastPage.pagination_metadata.cursor ?? false,
        }
    )

    useIntersectionObserver({
        target: loadMoreButtonRef,
        onIntersect: fetchNextPage,
        enabled: hasNextPage,
    })

    console.log(`THE DATA `, data)

    if (isLoading) {
        return <div/>;
    }
    if (isError) {
        return <div>{error!.message}</div>;
    }
    if (data.pages.length === 0) {
        return <div>Coming Soon!</div>
    }

    return (data.pages.map(page => page.posts.map(post => <BlogPostPreview key={post.id} post={post}/>)))
}
