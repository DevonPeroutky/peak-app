import React from "react";
import {DeleteOutlined, LinkOutlined} from "@ant-design/icons/lib";
import "./display-link-menu.scss"
import {Divider} from "antd";
import {isExternalLink} from "../../../link-util";
import {Link} from "react-router-dom";

interface DisplayLinkProps {
    url: string,
    setEditing: (isEditing: boolean) => void
    clearLink: () => void
}
export const DisplayLinkMenu = (props: DisplayLinkProps) => {
    const { url, setEditing, clearLink } = props

    return (
        <div className="display-link-content-body">
            <div
                className="edit-link-text"
                onClick={() => {
                setEditing(true)
            }}>Edit Link</div>
            <Divider type={"vertical"} className={"link-menu-divider"}/>
            <DaLink url={url}/>
            <Divider type={"vertical"} className={"link-menu-divider"}/>
            <div>
                <DeleteOutlined className="delete-icon" onClick={clearLink}/>
            </div>
        </div>
    )
};


export const DaLink = (props: { url: string }) => {
    const { url } = props;

    if (isExternalLink(url)) {
       return (
           <a href={url} target={(isExternalLink(url)) ? "_blank" : "_self"}>
               <LinkOutlined className="link-icon"/>
           </a>
       )
    } else {
        return (
            <Link to={url}>
                <LinkOutlined className="link-icon"/>
            </Link>
        )
    }

}
