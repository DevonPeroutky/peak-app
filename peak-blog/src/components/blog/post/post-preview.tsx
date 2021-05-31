import React from "react";
import {PeakPost} from "component-library";
import {useAppContext} from "../../../data/context";
import {Node} from "slate";
import Link from "next/link";
import moment from "moment";
import {EstimateReadTime} from "./read-time/EstimatedReadTime";

export const BlogPostPreview = (props: { post: PeakPost }) => {
    const { post } = props
    const { author } = useAppContext()

    const titleNode = post.body[0]
    // const postPreviewBody: Node[] = post.body.slice(1, 6)
    const title = Node.string(titleNode)

    return (
        <div className={"mb-20"}>
            <Link href={`post/${post.id}`}>
                <h1 className={"mb-2 cursor-pointer hover:text-blue-500 font-semibold text-4xl"}>{title}</h1>
            </Link>
            <div className={"mb-2 text-lg text-gray-500 font-light"}>
                {post.subtitle}
            </div>
            <div className={"text-base text-gray-400 font-light text-sm mb-4"}>
                <span className={"mr-1"}>{author.given_name} {author.family_name}</span> • <span className={"mx-1"}>{moment(post.created_at).format('LL') }</span> • <EstimateReadTime className={"mx-1"} body={post.body}/>
            </div>
        </div>
    )
}