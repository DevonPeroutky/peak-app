import {Form, Input, InputProps} from "antd";
import React from "react";
import "./subdomain-input.scss"

export const SubdomainInput = (props: InputProps) =>
    <Input {...props} className={"subdomain-input minimal-text-input"} bordered={false} placeholder="{Your Subdomain here}" prefix={"https://"} suffix={".cur8.dev"}/>
