import {Form, FormItemProps, Input, InputProps, Spin} from "antd";
import React from "react";
import "./subdomain-input.scss"
import {subdomain_regex} from "../../../utils/blog";
import {Rule} from "antd/es/form";
import {checkForSubdomainRequest} from "../../../client/blog";

export const SubdomainInput = (props: InputProps) =>
    <Input {...props} className={"subdomain-input minimal-text-input"} bordered={false} placeholder="{Your Subdomain here}" prefix={"https://"} suffix={".cur8.dev"}/>

export const SUBDOMAIN_RULES: Rule[] = [
    {
        required: true,
        pattern: subdomain_regex,
        message: 'Subdomain must be less than 63 characters, only contain letters/numbers/hyphens, but must begin and end with a alphanumeric'
    },
    {
        validator: async (rule, value) => {
            return checkForSubdomainRequest(value).catch(err => {
                if (err.response && err.response.status === 404) {
                    return Promise.resolve('Subdomain is available')
                }
                return Promise.reject('Subdomain is taken')
            })
        },
        validateTrigger: "onSubmit"
    }
]
