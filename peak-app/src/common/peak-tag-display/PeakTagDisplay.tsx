import React from 'react'
import {Tag} from "antd";
import { capitalize } from "lodash";
import {useTags} from "../../client/tags";
import {PeakTag} from "../../types";
import "./peak-tag-display.scss"

export const PeakTagDisplay = (props: { tagId: string }) => {
    const { tagId } = props
    const tags = useTags()
    const tag: PeakTag | undefined = tags.find(tag => tag.id === tagId);

    if (tag == null) {
        console.error(`We are trying to render tag ${tagId} which we don't have!`)
        return null;
    }
    return (
        <Tag color={tag.color} key={tagId} className={"peak-tag"}>{capitalize(tag.title)}</Tag>
    )
};
