import React, {useState} from 'react';
import {Button, Input} from "antd";
import {NoteTagSelect} from "../../../rich-text-editor/plugins/peak-knowledge-plugin/components/peak-knowledge-node/peak-tag-select/component/NoteTagSelect";
import "./publish-post-form.scss"
import {ShareAltOutlined} from "@ant-design/icons/lib";
import {createPeakPost} from "../../../../redux/slices/posts/postsSlice";
import {PeakWikiPage} from "../../../../constants/wiki-types";
import {BlogConfiguration} from "../../../../redux/slices/blog/types";
import {PeakPost, POST_TYPE, POST_VISIBILITY} from "../../../../redux/slices/posts/types";
import {PeakTag} from "../../../../types";

export const PublishPostForm = (props: { page: PeakWikiPage, blogConfiguration: BlogConfiguration, userId: string }) => {
    const { page, userId, blogConfiguration } = props
    const [title, setTitle] = useState("");
    const [snippet, setSnippet] = useState("");
    const [loading, setLoading] = useState(false)
    const [selectedTags, setTags] = useState<PeakTag[]>([])

    const createPublishPost = (): PeakPost => {
        return {
            id: page.id,
            title: title,
            snippet: snippet,
            body: page.body,
            tag_ids: selectedTags.map(t => t.id),
            subdomain: blogConfiguration.subdomain,
            post_type: POST_TYPE.blog_post.toString(),
            visibility: POST_VISIBILITY.public.toString(),
            user_id: userId
        } as PeakPost
    }

    const publishPost = () => {
        setLoading(true)
        createPeakPost(userId, blogConfiguration.subdomain, createPublishPost()).then(res => {
            console.log(`Res ` , res)
            setLoading(false)
        }).then()
    }

    return (
        <div className={"publish-post-container"}>
            <div className={"col"}>
                <h3>Story Preview</h3>
                <Input className={"minimal-text-input publish-text-input"} placeholder="Write a preview title" bordered={false} onChange={e => setTitle(e.target.value)}/>
                <Input className={"minimal-text-input publish-text-input"} placeholder="Write a preview snippet we'll use a subtitle" bordered={false}/>
            </div>
            <div className={"col"}>
                <h3>Publishing to: <b>TBD</b></h3>
                <NoteTagSelect selected_tags={[]} note_id={"TBD"}/>
                <div className={"row"}>
                    <Button
                        shape="round"
                        size={"large"}
                        icon={<ShareAltOutlined/>}
                        type={"primary"}
                        loading={loading}
                        onClick={() => publishPost()}
                    >
                        Publish
                    </Button>
                </div>
            </div>
        </div>
    )
}