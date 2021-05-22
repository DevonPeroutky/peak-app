import React from "react";
import {PeakPost} from "component-library";
import {useAppContext} from "../../../data/context";
import {Node} from "slate";
import Link from "next/link";
import moment from "moment";
import {DisplayEditor} from "../../rich-text-editor/DisplayEditor";

export const BlogPostPreview = (props: { post: PeakPost }) => {
    const { post } = props
    const { author } = useAppContext()

    const titleNode = post.body[0]
    // const postPreviewBody: Node[] = post.body.slice(1, 6)
    const title = Node.string(titleNode)

    return (
        <>
            <Link href={`post/${post.id}`}>
                <h1 className={"mb-6 cursor-pointer"}>{title}</h1>
            </Link>
            <div className={"text-gray-500 font-medium text-sm mb-4"}>
                <span>{author.given_name} {author.family_name}</span> / <span>{moment(post.created_at).format('LL') }</span>
            </div>
            <div>
                {post.subtitle}
            </div>
            {/*<DisplayEditor value={postPreviewBody} postId={post.id}/>*/}
        </>
    )
}