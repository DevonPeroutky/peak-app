import React, { useState } from 'react';
import {Button, Divider, Form, Input} from "antd";
import {CommentOutlined, CompassOutlined, RocketOutlined} from "@ant-design/icons/lib";
import {useCurrentUser} from "../../../utils/hooks";
import {useHistory} from "react-router-dom";
import {subdomain_regex} from "../../../utils/blog";
import {useBlog} from "../../../redux/slices/blog/hooks";

export const BlogSettings = (props: {}) => {
    const user = useCurrentUser()
    const history = useHistory();
    const blog = useBlog()

    const [loading, setLoading] = useState(false)

    const updateBlogConfiguration = (values) => {
       console.log('Fuck yeah ', values)
    }

    console.log(`Blog `, blog)

    return (
        <div className={"blog-settings-container"}>
            <h1>Setup your Blog</h1>
            <Divider/>
            <Form
                name="normal_login"
                onFinish={updateBlogConfiguration}
            >
                <h3>Publish Name</h3>
                <Form.Item
                    name="title"
                    rules={[
                        {
                            required: true,
                            type: "string",
                            max: 255,
                            message: 'Please enter your desired name for your blog. Max Length ',
                        },
                    ]}
                >
                    <Input prefix={<CompassOutlined className="input-icon"/>} placeholder="Publication Name" defaultValue={blog && blog.title}/>
                </Form.Item>
                <h3>One-line description</h3>
                <Form.Item
                    name="description"
                    rules={[
                        {
                            required: true,
                            type: "string",
                            max: 255,
                            message: 'Please enter a description for your blog',
                        },
                    ]}
                >
                    <Input prefix={<CommentOutlined className="input-icon"/>} placeholder="What is your blog about?"/>
                </Form.Item>
                <h3>Subdomain</h3>
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
                    <Input placeholder="Subdomain" suffix={".cur8.dev"}/>
                </Form.Item>
                <h3>Tags</h3>
                <div>TBD</div>
                <h3>About page</h3>
                <div>TBD</div>
                <h3>Blog logo</h3>
                <div>TBD</div>
                <h3>Cover Image</h3>
                <div>TBD</div>
                <Form.Item hasFeedback>
                    <Button icon={<RocketOutlined />} type="primary" htmlType="submit" className="login-form-button" loading={loading}>
                        Create my Blog
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}