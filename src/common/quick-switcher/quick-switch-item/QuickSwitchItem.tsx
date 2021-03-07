import React from 'react'
import {BookOutlined, EditOutlined, FileOutlined, MenuOutlined, ReadOutlined} from "@ant-design/icons/lib";
import "./quick-switch-item.scss"
import {AutoComplete} from "antd";
import { ELEMENT_H1, ELEMENT_H2, ELEMENT_H3, ELEMENT_H4, ELEMENT_H5 } from "@udecode/slate-plugins";
import {JOURNAL, TIMELINE, TITLE} from "../../rich-text-editor/types";
import {PeakDisplayNode} from "../../../redux/slices/user/types";
import {ELEMENT_PEAK_BOOK, ELEMENT_WEB_NOTE} from "../../rich-text-editor/plugins/peak-knowledge-plugin/constants";
import {ImageLoader} from "../../image-loader/ImageLoader";
const bookmark = require('../../../assets/icons/bookmark.svg');
const { Option } = AutoComplete;

const QuickSwitchItem = (props: { node: PeakDisplayNode }) => {
    const { node } = props;

    const renderIcon = (node: PeakDisplayNode) => {
        switch (node.header_type) {
            case ELEMENT_PEAK_BOOK:
                return <ReadOutlined className="quick-switch-item-icon"/>
            case ELEMENT_WEB_NOTE:
                // TODO: Once we are downloading and caching imaging, we can update this.
                return <img src={bookmark} className={"quick-switch-item-icon"}/>
                // return <EditOutlined className="quick-switch-item-icon"/>
                // return <ImageLoader className={"quick-switch-item-icon"} url={node.icon_url} fallbackElement={<EditOutlined className="quick-switch-item-icon"/>}/>
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
