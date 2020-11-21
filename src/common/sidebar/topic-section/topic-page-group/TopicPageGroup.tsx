import {Menu} from "antd";
import {TopicHeaderRow} from "../topic-header-row/TopicHeaderRow";
import {Link} from "react-router-dom";
import {capitalize_and_truncate} from "../../../../utils/strings";
import React from "react";
import {useCurrentPageId, useCurrentUser} from "../../../../utils/hooks";
import "./topic-page-group.scss"
import {PeakTopic} from "../../../../redux/topicSlice";
import {PeakWikiPage} from "../../../../redux/wikiPageSlice";

export const TopicPageGroup = (props: {topics: PeakTopic[]}) => {
    const { topics } = props
    const currentPageId = useCurrentPageId();
    const user = useCurrentUser()

    return (
        <Menu mode="inline" selectedKeys={[currentPageId!]} className={"topic-menu"}>
            {topics.map(topic =>
                // @ts-ignore
                <Menu.ItemGroup key={topic.id.toLowerCase()} title={<TopicHeaderRow topic={topic} user={user}/>}>
                    {topic.pages.map(page =>
                        <Menu.Item key={page.id}>
                            <Link to={`/topic/${topic.id.toLowerCase()}/wiki/${page.id}`}>
                                { (page.title && page.title.length > 0) ? capitalize_and_truncate(page.title) : "Untitled Page" }
                            </Link>
                        </Menu.Item>
                    )}
                </Menu.ItemGroup>
            )}
        </Menu>
    )
}

const TopicPageRow = (props: {page: PeakWikiPage, topicId: string}) => {
    const { page, topicId } = props
    return (
        <Menu.Item key={page.id}>
            <Link to={`/topic/${topicId.toLowerCase()}/wiki/${page.id}`}>
                { (page.title && page.title.length > 0) ? capitalize_and_truncate(page.title) : "Untitled Page" }
            </Link>
        </Menu.Item>
    )
}