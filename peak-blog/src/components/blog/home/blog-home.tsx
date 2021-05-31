import {fetch_posts_for_subdomain} from "../../../data/posts/posts";
import {useInfiniteQuery, useQuery, useQueryClient} from "react-query";
import {PeakPost, PeakPostListResponse} from "component-library";
import React from "react";
import {POSTS_KEY} from "../../../data/posts/types";
import {BlogPostPreview} from "../post/post-preview";
import useInfiniteScroll from "../../../hooks/useInfiniteScroll";
import {Subdomain} from "../../../data/subdomain/types";

export const BlogHome = (props: { subdomain: Subdomain }) => {
    const { subdomain } = props

    // Move this to satke more advantage of SSR?
    const { isLoading, isError, status, data, fetchNextPage, hasNextPage, error, isFetchingNextPage } = useInfiniteQuery<PeakPostListResponse, Error>(
        [POSTS_KEY],
        async ({ pageParam = 0 }) => fetch_posts_for_subdomain(subdomain.subdomain, pageParam),
        {
            staleTime: 600000,
            getPreviousPageParam: firstPage => firstPage.pagination_metadata.cursorBefore ?? false,
            getNextPageParam: lastPage => lastPage.pagination_metadata.cursor ?? false,
        }
    )


    useInfiniteScroll({ enabled: hasNextPage, fetchMore: fetchNextPage })

    if (isLoading) {
        return <div/>;
    }
    if (isError) {
        return <div>{error!.message}</div>;
    }
    if (data.pages.length === 0) {
        return <div>Coming Soon!</div>
    }

    const posts: PeakPost[] = data.pages.flatMap(page => page.posts)
    return (
        <div>
            <div className={"flex justify-center items-center flex-col divide-gray-50 border-b py-6"}>
                <h1 className={"mb-4"}>{subdomain.title}</h1>
                <h2 className={"text-gray-500 font-light text-center leading-normal"}>{subdomain.description}</h2>
            </div>
            <div className={"py-6"}>
                { posts.map(post => <BlogPostPreview key={post.id} post={post}/>) }
            </div>
        </div>
    )
}
