import React, {useState} from 'react';
import {Button, Result} from "antd";

export const PublishSuccess = (props: { postUrl: string}) => {
    return (
        <Result
            className={"animate__animated animate__zoomIn"}
            status="success"
            title="Published!"
            subTitle="Your post is live! Soon we'll have more tools to help you share these posts directly on to other platforms"
            extra={[
                <Button type="primary" key="console" href={props.postUrl} className="animate__animated animate__zoomIn">View the post on your blog</Button>,
            ]}
        />
    )
}