import React from 'react'
import {Layout, Menu} from 'antd';
import AddTopicModal from "../modals/add-topic/AddTopicModal";
import {Link} from "react-router-dom";
import cn from "classnames"
import {useCurrentPageId, useIsFullscreen, useTopics} from "../../utils/hooks";
import {EditOutlined, MenuOutlined, ReadOutlined} from "@ant-design/icons/lib";
import {TopicSection} from "./topic-section/topic-page-group/TopicPageGroup";
import {isElectron} from "../../utils/environment";
import 'antd/dist/antd.css';
import "./peak-sidebar.scss";
import {ProfileDropdown} from "../profile-dropdown/ProfileDropdown";
const { Sider } = Layout;


const PeakSidebar = (props: { }) => {
    const currentPageId = useCurrentPageId();
    const isFullscreen = useIsFullscreen()
    const topics = useTopics()

    return (
        <Sider className={cn("peak-sidebar", (isFullscreen || !isElectron) ? "fullscreen" : "not-fullscreen")} theme={"dark"}>
            {(isElectron && !isFullscreen) ? <div className={"electron-draggable-region"}/> : null }
            <ProfileDropdown/>
            <h3 className={"overview-header"}>Overview</h3>
            <Menu mode="inline" selectedKeys={[`home/${currentPageId}`]} className={"overview-menu"}>
                <Menu.Item key="home/scratchpad" className={(currentPageId === "home") ? "ant-menu-item-selected" : ""}>
                    <Link to="/home/scratchpad">
                        <MenuOutlined/>Scratchpad
                    </Link>
                </Menu.Item>
                <Menu.Item key="home/notes">
                    <Link to="/home/notes">
                        <EditOutlined/>Notes
                    </Link>
                </Menu.Item>
                <Menu.Item key="home/books">
                    <Link to="/home/books">
                        <ReadOutlined/>Books
                    </Link>
                </Menu.Item>
                <Menu.Item key="home/blog">
                    <Link to="/home/blog">
                        <ReadOutlined/>Blog
                    </Link>
                </Menu.Item>
            </Menu>
            <h4 className="topics-header">Wiki</h4>
            <TopicSection topics={topics}/>
            <AddTopicModal/>
        </Sider>
    )
};


export default PeakSidebar;