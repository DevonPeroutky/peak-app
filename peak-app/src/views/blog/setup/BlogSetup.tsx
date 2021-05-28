import React, { useState } from 'react';
import {Button, Divider, Form, Input} from "antd";
import {CommentOutlined, CompassOutlined, RocketOutlined} from "@ant-design/icons/lib";
import "./blog-setup.scss"
import {createBlog} from "../../../redux/slices/blog/blogSlice";
import {BlogConfiguration} from "../../../redux/slices/blog/types";
import {useCurrentUser} from "../../../utils/hooks";
import {subdomain_regex} from "../../../utils/blog";
import {SubdomainInput} from "../../../common/inputs/subdomain/SubdomainInput";
import {BlogLiveButton} from "../../../common/buttons/BlogLiveButton";
import {sleep} from "../../../chrome-extension/utils/generalUtil";
import {BlogCreateSuccess} from "./result/BlogSuccess";
import {blogUrlFromSubdomain} from "../../../utils/urls";
import {checkForSubdomainRequest} from "../../../client/blog";
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
    const isBlogSetup: BlogConfiguration | null = useBlog()
    const [loading, setLoading] = useState(false)

    // if (isBlogSetup) {
    //     history.push(`/home/blog`)
    // }

    const onFinish = (values: BlogConfiguration) => {
        setLoading(true)
        createBlog(user.id, values).then(res => {
            sleep(1000).then(_ => {
                setLoading(false)
                history.push(`/home/blog/setup/success?subdomain=${res.subdomain}`)
            })
        })
    }

    const checkForSubdomain = async (rule, value) => {
        return checkForSubdomainRequest(value).catch(err => {
            if (err.response && err.response.status === 404) {
                return Promise.resolve('Subdomain is available')
            }
            return Promise.reject('Subdomain is taken')
        })
    }

    return (
        <div className={"blog-setup-container"}>
            <h1 style={{marginBottom: "0px!important"}}>Create your Blog!</h1>
            <Form
                name="blog_setup"
                onFinish={onFinish}
            >
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
                    rules={[
                        {
                            required: true,
                            pattern: subdomain_regex,
                            message: 'Subdomain must be less than 63 characters, only contain letters/numbers/hyphens, but must begin and end with a alphanumeric'
                        },
                        {
                            validator: checkForSubdomain,
                            validateTrigger: "onSubmit"
                        }
                    ]}
                >
                    <SubdomainInput/>
                </Form.Item>
                <Form.Item hasFeedback>
                    <Button icon={<RocketOutlined />} type="primary" htmlType="submit" className="login-form-button" loading={loading}>
                        Create my Blog
                    </Button>
                    <BlogLiveButton/>
                </Form.Item>
            </Form>
        </div>
    )
}