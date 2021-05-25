import React, {useState} from 'react';
import {Button, Divider, Form, Input} from "antd";
import {NoteTagSelect} from "../../../rich-text-editor/plugins/peak-knowledge-plugin/components/peak-knowledge-node/peak-tag-select/component/NoteTagSelect";
import "./publish-post-form.scss"
import {RocketOutlined, ShareAltOutlined} from "@ant-design/icons/lib";
import {createPeakPost} from "../../../../redux/slices/posts/postsSlice";
import {PeakWikiPage} from "../../../../constants/wiki-types";
import {BlogConfiguration} from "../../../../redux/slices/blog/types";
import {PeakTag} from "../../../../types";
import {PeakPost, POST_TYPE, POST_VISIBILITY} from "component-library";

export const PublishPostForm = (props: { page: PeakWikiPage, blogConfiguration: BlogConfiguration, userId: string }) => {
    const { page, userId, blogConfiguration } = props
    // const [title, setTitle] = useState("");
    // const [snippet, setSnippet] = useState("");
    const [loading, setLoading] = useState(false)
    const [selectedTags, setTags] = useState<PeakTag[]>([])

    const createPublishPost = (title: string, subtitle: string): PeakPost => {
        return {
            id: page.id,
            title: title,
            snippet: subtitle,
            body: page.body,
            tag_ids: selectedTags.map(t => t.id),
            subdomain_id: blogConfiguration.subdomain,
            post_type: POST_TYPE.blog_post.toString(),
            visibility: POST_VISIBILITY.public.toString(),
            user_id: userId
        } as PeakPost
    }

    const initialPostValues = {
        title: page.title,
        subtitle: "",
        tags: []
    }

    const publishPost = (values: { title: string, subtitle: string }) => {
        console.log(`values!, `, values)
        setLoading(true)
        const blog_post_payload: PeakPost = createPublishPost(values.title, values.subtitle)
        createPeakPost(userId, blogConfiguration.subdomain, blog_post_payload).then(res => {
            setLoading(false)
        }).catch(res => {
            setLoading(false)
        })
    }

    return (
        <div className={"publish-post-container"}>
            <h1 style={{
                wordBreak: "normal",
                overflowWrap: "break-word",
                whiteSpace: "normal"
            }}>
                Publish this post to {blogConfiguration.subdomain}.cur8.dev!
            </h1>
            <Divider style={{"marginTop": "0px"}}/>
            <Form
                name="publish_post"
                style={{width:"100%"}}
                className={"publish-form"}
                initialValues={initialPostValues}
                onFinish={publishPost}
            >
                <h2>Story Preview</h2>
                <Form.Item
                    name={"title"}
                    rules={[
                        {
                            required: true,
                            type: "string",
                            max: 255,
                            message: 'We need a title for your post! Keep it under 255',
                        },
                    ]}
                    className={"form-row"}>
                    <Input
                        className={"minimal-text-input publish-text-input"}
                        required={true}
                        placeholder="Write a preview title"
                        bordered={false}
                    />
                </Form.Item>
                <Form.Item
                    name={"subtitle"}
                    rules={[
                        {
                            required: true,
                            type: "string",
                            max: 1000,
                            message: "Give people a quick overview of what you will be covering",
                        },
                    ]}
                    className={"form-row"}>
                    <Input
                        className={"minimal-text-input publish-text-input"}
                        required={true}
                        placeholder="Write a preview snippet we'll use a subtitle"
                        bordered={false}
                    />
                </Form.Item>
                <div className={"form-row"}>
                    <h2>Post Organization</h2>
                </div>
                <div className={"form-row"}>
                    <NoteTagSelect selected_tags={[]} note_id={"TBD"} input_className={"minimal-text-input"}/>
                </div>
                <Form.Item hasFeedback className={"form-row"}>
                    <Button
                        shape="round"
                        htmlType={"submit"}
                        size={"large"}
                        style={{marginTop: "25px", maxWidth: "fit-content"}}
                        icon={<ShareAltOutlined/>}
                        type={"primary"}
                        loading={loading}
                    >
                        {(loading) ? "Publishing" : "Publish"}
                    </Button>
                </Form.Item>
            </Form>
            {/*<div className={"row"}>*/}
            {/*    <h3>Story Preview</h3>*/}
            {/*    <Input className={"minimal-text-input publish-text-input"} required={true} placeholder="Write a preview title" bordered={false} onChange={e => setTitle(e.target.value)}/>*/}
            {/*    <Input className={"minimal-text-input publish-text-input"} required={true} placeholder="Write a preview snippet we'll use a subtitle" bordered={false}/>*/}
            {/*</div>*/}
            {/*<div className={"row"}>*/}
            {/*    <h3>Publishing to: <b>TBD</b></h3>*/}
            {/*    <NoteTagSelect selected_tags={[]} note_id={"TBD"}/>*/}
            {/*    <Button*/}
            {/*        shape="round"*/}
            {/*        size={"large"}*/}
            {/*        style={{marginTop: "25px", maxWidth: "fit-content"}}*/}
            {/*        icon={<ShareAltOutlined/>}*/}
            {/*        type={"primary"}*/}
            {/*        loading={loading}*/}
            {/*    >*/}
            {/*        Publish*/}
            {/*    </Button>*/}
            {/*</div>*/}
        </div>
    )
}