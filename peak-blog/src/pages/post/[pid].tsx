import { NextPage } from "next";
import React from "react";
import {useRouter} from "next/router";
import {useQuery, useQueryClient} from "react-query";
import {PeakPost} from "component-library";
import {fetch_post} from "../../data/posts/posts";
import {BlogPost} from "../../components/blog/post/post";
import {POST_KEY_PREFIX} from "../../data/posts/types";
import Error from "next/error";

// TODO: Load the subdomain / author / posts if not done already?
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

    console.log(`WTFFFF `, status)
    console.log(`Hello `, isError)

    if (isError) {
        console.log(`THe error: `, error)
        return <Error statusCode={500}/>
    }


    if (isLoading) {
        return <div>Load THIS HO!</div>
    }

    // @ts-ignore
    return (
        <BlogPost post={data}/>
    )
}
export default Post