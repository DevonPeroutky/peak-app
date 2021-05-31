import {fetch_posts_for_subdomain} from "../../../data/posts/posts";
import {useInfiniteQuery, useQuery, useQueryClient} from "react-query";
import {PeakPost, PeakPostListResponse} from "component-library";
import React from "react";
import {POSTS_KEY} from "../../../data/posts/types";
import {BlogPostPreview} from "../post/post-preview";
import useInfiniteScroll from "../../../hooks/useInfiniteScroll";
import {useAppContext} from "../../../data/context";
import Link from "next/link";

export const BlogHome = (props) => {
    const { subdomain, author } = useAppContext()

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
            <div className={"flex justify-center items-center flex-col divide-gray-50 border-b pt-12"}>
                <h1 className={"mb-4"}>{subdomain.title}</h1>
                <h2 className={"text-gray-500 font-light text-center leading-normal pb-24"}>{subdomain.description}</h2>
                <div className={"w-full flex items-center pb-4 text-gray-600 font-light justify-between"}>
                    <div className={"flex items-center"}>
                        <button className={"mr-5 cursor-pointer rounded-full px-4 py-2 border text-sm border-gray-400 hover:border-blue-400 hover:text-blue-400"}>Follow</button>
                        <span className={"mr-5 cursor-pointer"}>255 Followers</span>
                        <Link href={"/about"}>
                            <span className={"mr-5 cursor-pointer"}>About Me</span>
                        </Link>
                    </div>
                    <div className={"flex"}>
                        <span className={"mr-2 cursor-pointer hover:text-blue-400"}>
                            <svg viewBox="64 64 896 896" focusable="false" data-icon="twitter" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                                <path d="M928 254.3c-30.6 13.2-63.9 22.7-98.2 26.4a170.1 170.1 0 0075-94 336.64 336.64 0 01-108.2 41.2A170.1 170.1 0 00672 174c-94.5 0-170.5 76.6-170.5 170.6 0 13.2 1.6 26.4 4.2 39.1-141.5-7.4-267.7-75-351.6-178.5a169.32 169.32 0 00-23.2 86.1c0 59.2 30.1 111.4 76 142.1a172 172 0 01-77.1-21.7v2.1c0 82.9 58.6 151.6 136.7 167.4a180.6 180.6 0 01-44.9 5.8c-11.1 0-21.6-1.1-32.2-2.6C211 652 273.9 701.1 348.8 702.7c-58.6 45.9-132 72.9-211.7 72.9-14.3 0-27.5-.5-41.2-2.1C171.5 822 261.2 850 357.8 850 671.4 850 843 590.2 843 364.7c0-7.4 0-14.8-.5-22.2 33.2-24.3 62.3-54.4 85.5-88.2z"/>
                            </svg>
                        </span>
                        <span className={"mr-2 cursor-pointer hover:text-blue-400"}>
                            <svg viewBox="64 64 896 896" focusable="false" data-icon="github" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                                <path d="M511.6 76.3C264.3 76.2 64 276.4 64 523.5 64 718.9 189.3 885 363.8 946c23.5 5.9 19.9-10.8 19.9-22.2v-77.5c-135.7 15.9-141.2-73.9-150.3-88.9C215 726 171.5 718 184.5 703c30.9-15.9 62.4 4 98.9 57.9 26.4 39.1 77.9 32.5 104 26 5.7-23.5 17.9-44.5 34.7-60.8-140.6-25.2-199.2-111-199.2-213 0-49.5 16.3-95 48.3-131.7-20.4-60.5 1.9-112.3 4.9-120 58.1-5.2 118.5 41.6 123.2 45.3 33-8.9 70.7-13.6 112.9-13.6 42.4 0 80.2 4.9 113.5 13.9 11.3-8.6 67.3-48.8 121.3-43.9 2.9 7.7 24.7 58.3 5.5 118 32.4 36.8 48.9 82.7 48.9 132.3 0 102.2-59 188.1-200 212.9a127.5 127.5 0 0138.1 91v112.5c.8 9 0 17.9 15 17.9 177.1-59.7 304.6-227 304.6-424.1 0-247.2-200.4-447.3-447.5-447.3z"/>
                            </svg>
                        </span>
                            <span className={"mr-2 cursor-pointer hover:text-blue-400"}>
                            <svg viewBox="64 64 896 896" focusable="false" data-icon="instagram" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                                <path d="M512 306.9c-113.5 0-205.1 91.6-205.1 205.1S398.5 717.1 512 717.1 717.1 625.5 717.1 512 625.5 306.9 512 306.9zm0 338.4c-73.4 0-133.3-59.9-133.3-133.3S438.6 378.7 512 378.7 645.3 438.6 645.3 512 585.4 645.3 512 645.3zm213.5-394.6c-26.5 0-47.9 21.4-47.9 47.9s21.4 47.9 47.9 47.9 47.9-21.3 47.9-47.9a47.84 47.84 0 00-47.9-47.9zM911.8 512c0-55.2.5-109.9-2.6-165-3.1-64-17.7-120.8-64.5-167.6-46.9-46.9-103.6-61.4-167.6-64.5-55.2-3.1-109.9-2.6-165-2.6-55.2 0-109.9-.5-165 2.6-64 3.1-120.8 17.7-167.6 64.5C132.6 226.3 118.1 283 115 347c-3.1 55.2-2.6 109.9-2.6 165s-.5 109.9 2.6 165c3.1 64 17.7 120.8 64.5 167.6 46.9 46.9 103.6 61.4 167.6 64.5 55.2 3.1 109.9 2.6 165 2.6 55.2 0 109.9.5 165-2.6 64-3.1 120.8-17.7 167.6-64.5 46.9-46.9 61.4-103.6 64.5-167.6 3.2-55.1 2.6-109.8 2.6-165zm-88 235.8c-7.3 18.2-16.1 31.8-30.2 45.8-14.1 14.1-27.6 22.9-45.8 30.2C695.2 844.7 570.3 840 512 840c-58.3 0-183.3 4.7-235.9-16.1-18.2-7.3-31.8-16.1-45.8-30.2-14.1-14.1-22.9-27.6-30.2-45.8C179.3 695.2 184 570.3 184 512c0-58.3-4.7-183.3 16.1-235.9 7.3-18.2 16.1-31.8 30.2-45.8s27.6-22.9 45.8-30.2C328.7 179.3 453.7 184 512 184s183.3-4.7 235.9 16.1c18.2 7.3 31.8 16.1 45.8 30.2 14.1 14.1 22.9 27.6 30.2 45.8C844.7 328.7 840 453.7 840 512c0 58.3 4.7 183.2-16.2 235.8z"/>
                            </svg>
                        </span>
                            <span className={"mr-2 cursor-pointer hover:text-blue-400"}>
                            <svg viewBox="64 64 896 896" focusable="false" data-icon="linkedin" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M847.7 112H176.3c-35.5 0-64.3 28.8-64.3 64.3v671.4c0 35.5 28.8 64.3 64.3 64.3h671.4c35.5 0 64.3-28.8 64.3-64.3V176.3c0-35.5-28.8-64.3-64.3-64.3zm0 736c-447.8-.1-671.7-.2-671.7-.3.1-447.8.2-671.7.3-671.7 447.8.1 671.7.2 671.7.3-.1 447.8-.2 671.7-.3 671.7zM230.6 411.9h118.7v381.8H230.6zm59.4-52.2c37.9 0 68.8-30.8 68.8-68.8a68.8 68.8 0 10-137.6 0c-.1 38 30.7 68.8 68.8 68.8zm252.3 245.1c0-49.8 9.5-98 71.2-98 60.8 0 61.7 56.9 61.7 101.2v185.7h118.6V584.3c0-102.8-22.2-181.9-142.3-181.9-57.7 0-96.4 31.7-112.3 61.7h-1.6v-52.2H423.7v381.8h118.6V604.8z"/>
                            </svg>
                        </span>
                    </div>
                </div>
            </div>
            <div className={"py-24"}>
                { posts.map(post => <BlogPostPreview key={post.id} post={post}/>) }
            </div>
        </div>
    )
}
