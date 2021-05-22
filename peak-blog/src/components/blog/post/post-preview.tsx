import React from "react";
import {PeakPost} from "component-library";
import {useAppContext} from "../../../data/context";
import {Node} from "slate";
import Link from "next/link";
import moment from "moment";

export const BlogPostPreview = (props: { post: PeakPost }) => {
    const { post } = props
    const { author } = useAppContext()

    const titleNode = post.body[0]
    // const postPreviewBody: Node[] = post.body.slice(1, 6)
    const title = Node.string(titleNode)

    return (
        <div className={"mb-24"}>
            <Link href={`post/${post.id}`}>
                <h1 className={"mb-6 cursor-pointer hover:text-blue-500"}>{title}</h1>
            </Link>
            <div className={"text-base text-gray-400 font-normal text-sm mb-6"}>
                <span>{author.given_name} {author.family_name}</span> / <span>{moment(post.created_at).format('LL') }</span>
            </div>
            <div className={"mb-4 text-lg text-gray-500 font-normal"}>
                {post.subtitle}
            </div>
            <Link href={`post/${post.id}`}>
                <span className={"border-b-2 border-blue-500 cursor-pointer hover:text-blue-500 py-0.5 text-sm font-medium text-gray-600"}>READ MORE →</span>
            </Link>
        </div>
    )
}