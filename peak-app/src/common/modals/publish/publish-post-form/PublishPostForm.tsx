import React, { useState, ReactNode } from 'react';
import {Button, Input} from "antd";
import {NoteTagSelect} from "../../../rich-text-editor/plugins/peak-knowledge-plugin/components/peak-knowledge-node/peak-tag-select/component/NoteTagSelect";
import "./publish-post-form.scss"
import {ShareAltOutlined} from "@ant-design/icons/lib";

export const PublishPostForm = (props: {}) => {
    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(false)

    return (
        <div className={"publish-post-container"}>
            <div className={"col"}>
                <h3>Story Preview</h3>
                <Input className={"minimal-text-input publish-text-input"} placeholder="Write a preview title" bordered={false}/>
                <Input className={"minimal-text-input publish-text-input"} placeholder="Write a preview snippet we'll use a subtitle" bordered={false}/>
            </div>
            <div className={"col"}>
                <h3>Publishing to: <b>TBD</b></h3>
                <NoteTagSelect selected_tags={[]} note_id={"TBD"}/>
                <div className={"row"}>
                    <Button
                        shape="round"
                        size={"large"}
                        icon={<ShareAltOutlined/>}
                        type={"primary"}
                        loading={loading}
                    >
                        Publish
                    </Button>
                </div>
            </div>
        </div>
    )
}