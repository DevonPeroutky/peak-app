import React, {useEffect, useRef, useState} from "react";
import {DeleteOutlined, LinkOutlined} from "@ant-design/icons/lib";
import "./display-link-menu.scss"
import {Divider} from "antd";

interface DisplayLinkProps {
    link: string,
    setEditing: (isEditing: boolean) => void
    clearLink: () => void
}
export const DisplayLinkMenu = (props: DisplayLinkProps) => {
    const { link, setEditing, clearLink } = props

    return (
        <div className="display-link-content-body">
            <div
                className="edit-link-text"
                onClick={() => {
                setEditing(true)
            }}>Edit Link</div>
            <Divider type={"vertical"} className={"link-menu-divider"}/>
            <a href={link} target="_blank">
                <LinkOutlined className="link-icon"/>
            </a>
            <Divider type={"vertical"} className={"link-menu-divider"}/>
            <div>
                <DeleteOutlined className="delete-icon" onClick={clearLink}/>
            </div>
        </div>
    )
};
