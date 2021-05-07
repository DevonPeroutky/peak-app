import {Divider, Skeleton} from "antd";
import React from "react";
import "./note-skeleton.scss"

export const NoteSkeleton = (props) => {
    return (
        <div className={"peak-note-draft-view-container"}>
            <Skeleton paragraph={{ rows: 0}}/>
            <Skeleton active avatar={{ shape: 'square', size: 96}} className={"peak-draft-height"} paragraph={{ rows: 4 }}/>
            <Divider className={"note-divider"}/>
            <Skeleton active/>
        </div>
    )
}