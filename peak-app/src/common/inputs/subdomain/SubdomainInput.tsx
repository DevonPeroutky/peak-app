import {Form, Input} from "antd";
import React from "react";
import "./subdomain-input.scss"

export const SubdomainInput = (props: {}) => <Input {...props} className={"subdomain-input"} placeholder="{Your Subdomain here}" prefix={"https://"} suffix={".cur8.dev"}/>
