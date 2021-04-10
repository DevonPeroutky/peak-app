import React from "react";
import {ReactEditor, RenderElementProps} from "slate-react";
import cn from 'classnames';
import {BulbOutlined, ReadOutlined} from "@ant-design/icons/lib";
import "./peak-learning-node.scss"
import {PeakTag} from "../../../../../../types";
import {PeakTagSelect} from "../peak-knowledge-node/peak-tag-select/component/PeakTagSelect";
import {isNodeEmpty} from "../../utils";
import { useTSlate } from "@udecode/slate-plugins";

export const PeakLearningNode = (props: RenderElementProps) => {
    const { element } = props
    const editor = useTSlate()
    const path = ReactEditor.findPath(editor, props.element)
    const tags = element.selected_tags as PeakTag[]
    const isEmpty: boolean = isNodeEmpty(element)

    return (
        <div className={cn("peak-learning-node-container", (isEmpty) ? "empty" : "")} {...props.attributes} key={0} tabIndex={0}>
            <div className={"peak-learning-title-row learning"} contentEditable={false}>
                <BulbOutlined className={"title-row-icon learning"}/>
                <span className={"learning-label"}>Learning</span>
            </div>
            <div className="learning-body">
                {props.children}
            </div>
            <PeakTagSelect nodeId={element.id as number} nodePath={path} selected_tags={(tags) ? tags : []}/>
        </div>
    )
}

