import {RenderElementProps} from "slate-react";
import React from "react";
import "./peak-learning.scss"
import { Select } from 'antd';

const { Option } = Select;

export const PeakLearning = (props: RenderElementProps) => {

    return (
        <div className={"peak-learning-container"} {...props.attributes} key={0}>
            {props.children}
            <PeakLearningSelect/>
        </div>
    )
}

const PeakLearningSelect = (props: {}) => {
    const children = [];
    for (let i = 10; i < 36; i++) {
        // @ts-ignore
        children.push(<Option key={i.toString(36) + i}>{i.toString(36) + i}</Option>);
    }
    const handleChange = (value) => {
        console.log(`Selected ${value}`)
    }
    return (
        <div className={"peak-learning-select-container"} data-slate-editor >
            <Select
                mode="tags"
                style={{ width: '100%' }}
                placeholder="Tags Mode"
                onChange={handleChange}>
                {children}
            </Select>
        </div>
    )
}