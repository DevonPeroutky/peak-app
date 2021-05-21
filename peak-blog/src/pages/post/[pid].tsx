import { NextPage } from "next";
import React from "react";

// TODO: Move this to shared
import {useRouter} from "next/router";
import {useQuery, useQueryClient} from "react-query";
import {PeakPost} from "component-library";
import {fetch_post} from "../../data/posts/posts";
import {BlogPost} from "../../components/blog/post/post";
import styles from "../../../styles/Home.module.css";
import {POST_KEY_PREFIX} from "../../data/posts/types";

const Post: NextPage<{}> = (props) => {
    const router = useRouter()
    const post_id: string = router.query["pid"] as string
    const queryClient = useQueryClient()

    const fetch_post_wrapper = () => {
        if (!post_id) {
            console.log(`The undefined`)
            return undefined
        }
        return fetch_post(post_id)
    }

    const { isLoading, isError, status, data, error } = useQuery<PeakPost, Error>(
        [POST_KEY_PREFIX, post_id],
        fetch_post_wrapper,
        {
            initialData: () => {
                if (!post_id) return undefined
                return queryClient.getQueryData<PeakPost[]>('posts')?.find(p => p.id === post_id)
            }
        }
    )

    if (!data) {
        return <div/>
    }

    // @ts-ignore
    return (
        <div className={styles.container}>
            <BlogPost post={data}/>)
        </div>
    )
}
export default Post