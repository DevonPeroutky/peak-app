import React from 'react'
import {FileOutlined, MenuOutlined, ReadOutlined} from "@ant-design/icons/lib";
import {PeakDisplayNode} from "../../../redux/slices/userSlice";
import "./quick-switch-item.scss"
import {AutoComplete} from "antd";
import { ELEMENT_H1, ELEMENT_H2, ELEMENT_H3, ELEMENT_H4, ELEMENT_H5 } from "@udecode/slate-plugins";
import {JOURNAL, TIMELINE, TITLE} from "../../rich-text-editor/types";
const { Option } = AutoComplete;

const QuickSwitchItem = (props: { node: PeakDisplayNode }) => {
    const { node } = props;

    const renderIcon = (node: PeakDisplayNode) => {
        switch (node.header_type) {
            case TITLE:
                return <FileOutlined className="quick-switch-item-icon"/>
            case JOURNAL:
                return <ReadOutlined className="quick-switch-item-icon"/>
            case TIMELINE:
                return <MenuOutlined className="quick-switch-item-icon"/>
            case ELEMENT_H1:
                return <span className="iconify  quick-switch-header-icon" data-icon="mdi:format-header-1" data-inline="false"/>
            case ELEMENT_H2:
                return <span className="iconify  quick-switch-header-icon" data-icon="mdi:format-header-2" data-inline="false"/>
            case ELEMENT_H3:
                return <span className="iconify  quick-switch-header-icon" data-icon="mdi:format-header-3" data-inline="false"/>
            case ELEMENT_H4:
                return <span className="iconify  quick-switch-header-icon" data-icon="mdi:format-header-4" data-inline="false"/>
            case ELEMENT_H5:
                return <span className="iconify  quick-switch-header-icon" data-icon="mdi:format-header-5" data-inline="false"/>
            default:
                return <FileOutlined className="quick-switch-item-icon"/>
        }
    }

    return (
            <div className={"quick-switch-item-container"}>
                <div className={"quick-switch-item"}>
                    <div className={"quick-switch-icon-container"}>
                        {renderIcon(node)}
                    </div>
                    <div className={"quick-switch-item-body"}>
                        <span className={"item-title"}>{node.title}</span>
                        <span className={"item-path"}>{node.path}</span>
                    </div>
                </div>
            </div>
    )
};

export const renderPeakDisplayNodesInList = (nodes: PeakDisplayNode[]) => {
    return (
        nodes.map(node =>
            <Option
                key={node.url}
                value={node.url}
                children={
                    <QuickSwitchItem node={node}/>
                }
            />
        )
    )
}
