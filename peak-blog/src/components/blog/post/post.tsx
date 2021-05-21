import React from "react";
import {PeakPost} from "component-library";
import styles from "../../../../styles/Home.module.css";
import {DisplayEditor} from "../../rich-text-editor/DisplayEditor";
import { Node } from "slate";
import moment from "moment";

export const Post = (props: { post: PeakPost }) => {
    const { post } = props

    const titleNode = post.body[0]
    const bodySanTitle: Node[] = post.body.slice(1)
    const title = Node.string(titleNode)

    return (
        <div className={styles.contentContainer}>
            <h1 className={"mb-6"}>{title}</h1>
            <div className={"text-gray-500 font-medium text-sm mb-4"}>
                <span>{post.user_id}</span> / <span>{moment(post.created_at).format('LL') }</span>
            </div>
            <DisplayEditor value={bodySanTitle} postId={post.id}/>
        </div>
    )
}