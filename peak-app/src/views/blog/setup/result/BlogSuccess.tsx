import {Button, Result} from "antd";
import React from "react";
import { useHistory } from "react-router-dom";
import {blogUrlFromSubdomain, useQuery} from "../../../../utils/urls";


export const BlogCreateSuccess = (props) => {
    const history = useHistory()
    const query = useQuery();
    const subdomainParam: string | null = query.get("subdomain")

    if (!subdomainParam) {
       history.push(`/home/scratchpad`)
    }

    return (
        <Result
            className={"animate__animated animate__zoomIn"}
            status="success"
            title={<Title subdomain={subdomainParam}/>}
            subTitle="Publish any of your pages to your blog with one-click."
            extra={[
                <Button type="primary" key="console" onClick={() => history.push(`/home/scratchpad`)} className="animate__animated animate__zoomIn">Start writing</Button>,
            ]}
        />
    )
}

const Title = (props: { subdomain: string }) => {
   return (<span><a href={blogUrlFromSubdomain(props.subdomain)} target={"_blank"}>{props.subdomain}.cur8.dev</a> is live!</span>)
}