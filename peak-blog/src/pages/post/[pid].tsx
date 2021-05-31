import { NextPage } from "next";
import React from "react";
import {useRouter} from "next/router";
import {useQuery, useQueryClient} from "react-query";
import {PeakPost, PeakPostListResponse} from "component-library";
import {fetch_post} from "../../data/posts/posts";
import {BlogPost} from "../../components/blog/post/post";
import {POST_KEY_PREFIX, POSTS_KEY} from "../../data/posts/types";
import Error from "next/error";
import Link from "next/link";
import styles from "../../../styles/Home.module.css";

// TODO: Load the subdomain / author / posts if not done already?
const Post: NextPage<{}> = (props) => {
    const router = useRouter()
    const post_id: string = router.query["pid"] as string
    const queryClient = useQueryClient()

    const { isLoading, isError, status, data, error } = useQuery<PeakPost, Error>(
        [POST_KEY_PREFIX, post_id],
        () => fetch_post(post_id),
        {
            initialData: () => {
                if (!post_id) return undefined
                const posts: PeakPost[] = queryClient.getQueryData<{pages: PeakPostListResponse}>(POSTS_KEY)?.pages.flatMap(page => page.posts)
                return (posts) ? posts.find(p => p.id === post_id) : undefined
            }
        }
    )

    if (isError) {
        console.log(`THe error: `, error)
        return <Error statusCode={500}/>
    }

    if (isLoading) {
        return <div>Load THIS HO!</div>
    }

    return (
        <div className={styles.postContainer}>
            <div className={"flex w-full mb-4 py-8"}>
                <Link href={"/"}>
                    <div className={"flex items-center cursor-pointer p-2 -ml-2 hover:bg-gray-200 rounded"}>
                        <svg viewBox="0 0 1024 1024" focusable="false" data-icon="caret-left" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                            <path d="M689 165.1L308.2 493.5c-10.9 9.4-10.9 27.5 0 37L689 858.9c14.2 12.2 35 1.2 35-18.5V183.6c0-19.7-20.8-30.7-35-18.5z"/>
                        </svg>
                        Home
                    </div>
                </Link>
            </div>
            <BlogPost post={data}/>
        </div>
    )
}
export default Post