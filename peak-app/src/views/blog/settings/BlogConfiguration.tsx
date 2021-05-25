import React, { useState } from 'react';
import {Button, Divider, Form, Input, message, notification} from "antd";
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
            notification.error({message: "Failed to update your blog settings. Tell Devon"} )
            setLoading(false)
        })
    }

    return (
        <div className={"blog-configuration-container"}>
            <h1 style={{marginBottom: "0px!important"}}>Configure your Blog</h1>
            <Divider style={{marginTop: "0px"}}/>
            <Form
                name="blog_configuration"
                initialValues={blog}
                onFinish={updateBlog}
            >
                <h3>Publish Name</h3>
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
                        />
                </Form.Item>
                <h3>One-line description</h3>
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
                    <SubdomainInput/>
                </Form.Item>
                {/*<h3>About page</h3>*/}
                {/*<div>TBD</div>*/}
                {/*<h3>Blog logo</h3>*/}
                {/*<div>TBD</div>*/}
                {/*<h3>Cover Image</h3>*/}
                {/*<div>TBD</div>*/}
                <Form.Item hasFeedback>
                    <Button icon={<RocketOutlined />} type="primary" htmlType="submit" className="login-form-button" loading={loading}>
                        {(loading) ? "Saving" : "Save Changes"}
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}