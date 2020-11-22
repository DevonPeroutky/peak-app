import React, {useEffect, useState} from 'react'
import 'antd/dist/antd.css';
import "./peak-sidebar.scss";
import {Layout, Menu, Divider, message} from 'antd';
import { PeakLogo } from "../logo/PeakLogo";
import AddTopicModal from "../modals/add-topic/AddTopicModal";
import {Link, useHistory} from "react-router-dom";
import cn from "classnames"
import {useCurrentPageId, useIsFullscreen, useTopics} from "../../utils/hooks";
import {ELECTRON} from "../../constants/constants";
import { ReadOutlined} from "@ant-design/icons/lib";

import config from "../../constants/environment-vars"
import {TopicSection} from "./topic-section/topic-page-group/TopicPageGroup";
const { Sider } = Layout;


const PeakSidebar = (props: { }) => {
    const currentPageId = useCurrentPageId();
    const isFullscreen = useIsFullscreen()
    const isElectron = config.dist === ELECTRON
    const topics = useTopics()

    return (
        <Sider className={cn("peak-sidebar", (isFullscreen || !isElectron) ? "fullscreen" : "not-fullscreen")} theme={"dark"}>
            {(isElectron && !isFullscreen) ? <div className={"electron-draggable-region"}/> : null }
            <div className={cn("peak-logo-container")}>
                <PeakLogo className={"sidebar-logo"}/>
            </div>
            <h3 className={"overview-header"}>Overview</h3>
            <Menu mode="inline" selectedKeys={[`home/${currentPageId}`]} className={"overview-menu"}>
                <Menu.Item key="home/journal">
                    {/*<Link to={`${match.url}/journal`}>*/}
                    <Link to="/home/journal">
                        <ReadOutlined />Journal
                    </Link>
                </Menu.Item>
            </Menu>
            <h3 className="topics-header">Wiki</h3>
            <TopicSection topics={topics}/>
            <AddTopicModal/>
        </Sider>
    )
};


export default PeakSidebar;