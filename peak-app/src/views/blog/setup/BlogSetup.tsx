import React, {useEffect, useState} from 'react';
import {Button, Divider, Form, Input, Spin} from "antd";
import {CommentOutlined, CompassOutlined, PlusCircleOutlined, RocketOutlined} from "@ant-design/icons/lib";
import "./blog-setup.scss"
import {createBlog} from "../../../redux/slices/blog/blogSlice";
import {BlogConfiguration} from "../../../redux/slices/blog/types";
import {useCurrentUser} from "../../../utils/hooks";
import {SUBDOMAIN_RULES, SubdomainInput} from "../../../common/inputs/subdomain/SubdomainInput";
import {sleep} from "../../../chrome-extension/utils/generalUtil";
import {useBlog} from "../../../redux/slices/blog/hooks";
import {useHistory} from "react-router-dom";

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
    const user = useCurrentUser()
    const history = useHistory()
    const [loading, setLoading] = useState(false)

    const onFinish = (values: BlogConfiguration) => {
        setLoading(true)
        createBlog(user.id, values).then(res => {
            sleep(1000).then(_ => {
                setLoading(false)
                history.push(`/home/blog/setup/success?subdomain=${res.subdomain}`)
            })
        })
    }

    return (
        <div className={"blog-setup-container"}>
            <h1 style={{marginBottom: "0px!important"}}>Create your Blog!</h1>
            <Form
                name="blog_setup"
                onFinish={onFinish}
            >
                <Spin spinning={loading}>
                    <Form.Item
                        name="title"
                        rules={[
                            {
                                required: true,
                                type: "string",
                                max: 255,
                                message: 'Please enter your desired name for your blog. Keep it under 255 characters',
                            },
                        ]}
                    >
                        <Input prefix={<CompassOutlined className="input-icon"/>} placeholder="Publication Name" className={"minimal-text-input"} bordered={false}/>
                    </Form.Item>
                    <Form.Item
                        name="description"
                        rules={[
                            {
                                required: true,
                                type: "string",
                                max: 500,
                                message: 'Please enter a description for your blog. Try to keep it under 255 characters like a Tweet',
                            },
                        ]}
                    >
                        <Input prefix={<CommentOutlined className="input-icon"/>} placeholder="What is your blog about?" className={"minimal-text-input"} bordered={false}/>
                    </Form.Item>
                    <Form.Item
                        name="subdomain"
                        rules={SUBDOMAIN_RULES}
                    >
                        <SubdomainInput/>
                    </Form.Item>
                </Spin>
                <Form.Item hasFeedback>
                    <Button
                        type="primary"
                        htmlType="submit"
                        className="login-form-button"
                        size={"large"}
                        loading={loading}>
                        Create my Blog
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}