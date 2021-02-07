import React from 'react'
import {Layout, Menu} from 'antd';
import { PeakLogo } from "../logo/PeakLogo";
import AddTopicModal from "../modals/add-topic/AddTopicModal";
import {Link} from "react-router-dom";
import cn from "classnames"
import {useCurrentPageId, useIsFullscreen, useTopics} from "../../utils/hooks";
import {EditOutlined, MenuOutlined} from "@ant-design/icons/lib";
import {TopicSection} from "./topic-section/topic-page-group/TopicPageGroup";
import {isElectron} from "../../utils/environment";
import 'antd/dist/antd.css';
import "./peak-sidebar.scss";
const { Sider } = Layout;


const PeakSidebar = (props: { }) => {
    const currentPageId = useCurrentPageId();
    const isFullscreen = useIsFullscreen()
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
                        <MenuOutlined/>Journal
                    </Link>
                </Menu.Item>
                <Menu.Item key="home/notes">
                    {/*<Link to={`${match.url}/journal`}>*/}
                    <Link to="/home/notes">
                        <EditOutlined/>Notes
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