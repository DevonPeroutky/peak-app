import {Menu} from "antd";
import {TopicHeaderRow} from "../topic-header-row/TopicHeaderRow";
import {Link} from "react-router-dom";
import {capitalize_and_truncate} from "../../../../utils/strings";
import React from "react";
import {useCurrentPageId, useCurrentUser} from "../../../../utils/hooks";
import "./topic-page-group.scss"
import {PeakPage, PeakTopic} from "../../../../redux/topicSlice";
import {PeakWikiPage} from "../../../../redux/wikiPageSlice";
import {useDrag, useDrop} from "react-dnd";
import cn from "classnames"

export const ItemTypes = {
    TOPIC_PAGE_ITEM: 'topic_page_item'
}

export const TopicPageGroup = (props: {topics: PeakTopic[]}) => {
    const { topics } = props
    const currentPageId = useCurrentPageId();
    const user = useCurrentUser()
    const [{ isDragging, draggedItem }, drag] = useDrag({
        item: { type: ItemTypes.TOPIC_PAGE_ITEM },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
            draggedItem: !!monitor.getItem()
        })
    })

    // const [{ isOver }, drop] = useDrop({
    //     accept: ItemTypes.TOPIC_PAGE_ITEM,
    //     drop: () => movePageToDifferentTopic(),
    //     collect: (monitor) => ({
    //         isOver: !!monitor.isOver()
    //     })
    // })

    return (
        <Menu mode="inline" selectedKeys={[currentPageId!]} className={"topic-menu"}>
            {topics.map(topic =>
                // @ts-ignore
                <Menu.ItemGroup key={topic.id.toLowerCase()} title={<TopicHeaderRow topic={topic} user={user}/>}>
                    {topic.pages.map(page =>
                        // <Menu.Item key={page.id}>
                        //     <Link
                        //         to={`/topic/${topic.id.toLowerCase()}/wiki/${page.id}`}
                        //         ref={drag}
                        //         className={cn((isDragging) ? "dragging" : "", (isOver) ? "hovering" : "")}>
                        //         { (page.title && page.title.length > 0) ? capitalize_and_truncate(page.title) : "Untitled Page" }
                        //     </Link>
                        // </Menu.Item>
                        <TopicPageRow key={page.id} page={page} topicId={topic.id.toLowerCase()}/>
                    )}
                </Menu.ItemGroup>
            )}
        </Menu>
    )
}

const TopicPageRow = (props: {page: PeakPage, topicId: string}) => {
    const { page, topicId } = props
    return (
        <Menu.Item key={page.id}>
            <Link to={`/topic/${topicId.toLowerCase()}/wiki/${page.id}`}>
                { (page.title && page.title.length > 0) ? capitalize_and_truncate(page.title) : "Untitled Page" }
            </Link>
        </Menu.Item>
    )
}

export function movePageToDifferentTopic() {
    console.log(`Move Page to topic: `)
}