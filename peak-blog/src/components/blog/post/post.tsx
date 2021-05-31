import React from "react";
import {PeakPost} from "component-library";
import {DisplayEditor} from "../../rich-text-editor/DisplayEditor";
import { Node } from "slate";
import moment from "moment";
import Link from "next/link";
import {useAppContext} from "../../../data/context";
import styles from "../../../../styles/Home.module.css";
import {EstimateReadTime} from "./read-time/EstimatedReadTime";

export const BlogPost = (props: { post: PeakPost }) => {
    const { post } = props
    const { author } = useAppContext()

    const titleNode = post.body[0]
    const bodySanTitle: Node[] = post.body.slice(1)
    const title = Node.string(titleNode)

    return (
        <div className={styles.postContainer}>
            <Link href={`post/${post.id}`}>
                <h1 className={"mb-8 cursor-pointer"}>{title}</h1>
            </Link>
            <div className={"text-gray-500 font-medium text-sm mb-14"}>
                <span>{author.given_name} {author.family_name}</span> · <span>{moment(post.created_at).format('LL') }</span> · <EstimateReadTime body={post.body}/>
            </div>
            <DisplayEditor value={bodySanTitle} postId={post.id}/>
        </div>
    )
}