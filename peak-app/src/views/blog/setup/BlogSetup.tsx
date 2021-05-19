import React, { useState } from 'react';
import {Button, Divider, Form, Input} from "antd";
import {CommentOutlined, CompassOutlined, ProfileOutlined, UserOutlined} from "@ant-design/icons/lib";
import "./blog-setup.scss"

/**
 * Creation:
 * 1. Blog Name
 * 2. Blog Description
 * 3. Subdomain
 * ----------------
 * - Import Mailing List
 * @param props
 * @constructor
 */
export const BlogSetup = (props: {}) => {
    const onFinish = (values) => {
        console.log('Received values of form: ', values);
    }

    const sub_regex = /^[A-Za-z0-9](?:[A-Za-z0-9\-]{0,61}[A-Za-z0-9])?$/

    return (
        <div className={"blog-setup-container"}>
            <h1>Setup your Blog</h1>
            <Divider/>
            <Form
                name="normal_login"
                onFinish={onFinish}
            >
                <Form.Item
                    name="blog_title"
                    rules={[
                        {
                            required: true,
                            type: "string",
                            max: 255,
                            message: 'Please enter your desired name for your blog. Max Length ',
                        },
                    ]}
                >
                    <Input prefix={<CompassOutlined className="input-icon"/>} placeholder="Publication Name"/>
                </Form.Item>
                <Form.Item
                    name="blog_description"
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
                <Form.Item
                    name="blog_subdomain"
                    rules={[
                        {
                            required: true,
                            pattern: sub_regex,
                            message: 'Subdomain must be less than 63 characters, only contain letters/numbers/hyphens, but must begin and end with a alphanumeric'
                        },
                    ]}
                >
                    <Input placeholder="Subdomain" suffix={".cur8.dev"}/>
                </Form.Item>
                <Form.Item hasFeedback>
                    <Button type="primary" htmlType="submit" className="login-form-button">
                        Create my Blog
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}