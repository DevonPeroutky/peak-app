import React, { useState } from 'react';
import {Button, Divider, Form, Input, message, notification, Spin} from "antd";
import {CommentOutlined, CompassOutlined, RocketOutlined} from "@ant-design/icons/lib";
import {subdomain_regex} from "../../../utils/blog";
import {useBlog} from "../../../redux/slices/blog/hooks";
import { SubdomainInput } from 'src/common/inputs/subdomain/SubdomainInput';
import "./blog-configuration.scss"
import {BlogConfiguration} from "../../../redux/slices/blog/types";
import {useCurrentUser} from "../../../utils/hooks";
import {updateBlogConfiguration} from "../../../redux/slices/blog/blogSlice";
import {sleep} from "../../../chrome-extension/utils/generalUtil";

export const BlogSettings = (props: {}) => {
    const blog = useBlog()
    const user = useCurrentUser()
    const [loading, setLoading] = useState(false)

    const updateBlog = (values: BlogConfiguration) => {
        setLoading(true)
        updateBlogConfiguration(user.id, {...values, id: blog.id}).then(_ => {
            sleep(1000).then(_ => {
                setLoading(false)
                notification.success({message: "Updated your configuration"} )
            })
        }).catch(_ => {
            notification.error({message: "Failed to update your blog settings."} )
            setLoading(false)
        })
    }

    return (
        <div className={"blog-configuration-container"}>
            <h1 style={{marginBottom: "0px!important"}} className={"peak-page-title"}>Configure your Blog</h1>
            <Form
                name="blog_configuration"
                initialValues={blog}
                onFinish={updateBlog}
            >
                <Spin spinning={loading}>
                    <h5>Publish Name</h5>
                    <Form.Item
                        name="title"
                        rules={[
                            {
                                required: true,
                                type: "string",
                                max: 255,
                                message: 'Please enter your desired name for your blog. Max Length is 255 characters',
                            },
                        ]}
                    >
                        <Input
                            prefix={<CompassOutlined className="input-icon"/>}
                            placeholder="Publication Name"
                            disabled={loading}
                        />
                    </Form.Item>
                    <h5>One-line description</h5>
                    <Form.Item
                        name="description"
                        rules={[
                            {
                                required: true,
                                type: "string",
                                max: 500,
                                message: 'Please enter a description for your blog',
                            },
                        ]}
                    >
                        <Input
                            prefix={<CommentOutlined className="input-icon"/>}
                            disabled={loading}
                            placeholder="What is your blog about?"/>
                    </Form.Item>
                    <h5>Subdomain</h5>
                    <Form.Item
                        name="subdomain"
                        rules={[
                            {
                                required: true,
                                pattern: subdomain_regex,
                                message: 'Subdomain must be less than 63 characters, only contain letters/numbers/hyphens, but must begin and end with a alphanumeric'
                            },
                        ]}
                    >
                        <SubdomainInput disabled={loading}/>
                    </Form.Item>
                <h3 style={{marginTop: "10px"}}>Coming Soon...</h3>
                <ul>
                    <li>Cover images and logos!</li>
                    <li>Ability for readers to subscribe your blog and receive your newsletter</li>
                    <li>Output RSS feeds</li>
                    <li>'About Me' pages</li>
                    <li>Social Integrations</li>
                </ul>
                </Spin>
                <Form.Item hasFeedback>
                    <Button size={"large"} type="primary" htmlType="submit" style={{marginTop: "10px"}} loading={loading}>
                        {(loading) ? "Saving Changes" : "Save Changes"}
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}