import {Menu} from "antd";
import {TopicHeaderRow} from "../topic-header-row/TopicHeaderRow";
import {Link} from "react-router-dom";
import {capitalize_and_truncate} from "../../../../utils/strings";
import React, {useCallback, useRef, useState} from "react";
import {useCurrentPageId, useCurrentUser} from "../../../../utils/hooks";
import "./topic-page-group.scss"
import {PeakPage, PeakTopic} from "../../../../redux/topicSlice";
import {DropTargetMonitor, useDrag, useDrop, XYCoord} from "react-dnd";
import cn from "classnames";
import update from 'immutability-helper';

export const ItemTypes = {
    TOPIC_PAGE_ITEM: 'topic_page_item'
}

export const TopicPageGroup = (props: {topics: PeakTopic[]}) => {
    const { topics } = props
    const currentPageId = useCurrentPageId();
    const user = useCurrentUser()

    const [topicList, setTopicList] = useState<PeakTopic[]>(topics)
    const [pages, setPages] = useState<PeakPage[]>(topics.flatMap(t => t.pages))

    // TODO IMPLEMENT THIS AND PASS IT TO <TOPICPAGEROW/>
    // --- This should update the backend orderIndex and redux
    const movePageToDifferentTopic = useCallback(
        (dragIndex: number, hoverIndex: number) => {
            console.log(`Drag Index: ${dragIndex}`)
            console.log(`Hover Index: ${hoverIndex}`)

            const dragPage = pages[dragIndex]
            setPages(
                update(pages, {
                    $splice: [
                        [dragIndex, 1],
                        [hoverIndex, 0, dragPage],
                    ],
                }),
            )
        },
        [pages],
    )

    return (
        <Menu mode="inline" selectedKeys={[currentPageId!]} className={"topic-menu"}>
            {topics.map(topic =>
                // @ts-ignore
                <Menu.ItemGroup key={topic.id.toLowerCase()} title={<TopicHeaderRow topic={topic} user={user}/>}>
                    {topic.pages.map((page, i) =>
                        <Menu.Item key={page.id}>
                            <TopicPageRow page={page} topicId={topic.id} index={i} movePage={movePageToDifferentTopic}/>
                        </Menu.Item>
                    )}
                </Menu.ItemGroup>
            )}
        </Menu>
    )
}


// ---- Take inspiration from Card ------------
// --------------------------------------------


interface DragItem {
    index: number
    id: string
    type: string
}
const TopicPageRow = (props: {page: PeakPage, topicId: string, index: number, movePage: (dragIndex: number, hoverIndex: number) => void}) => {
    const { page, topicId, index, movePage } = props
    const ref = useRef<HTMLDivElement>(null)
    const [, drop] = useDrop({
        accept: ItemTypes.TOPIC_PAGE_ITEM,
        hover(item: DragItem, monitor: DropTargetMonitor) {
            if (!ref.current) {
                return
            }
            const dragIndex = item.index
            const hoverIndex = index

            // Don't replace items with themselves
            if (dragIndex === hoverIndex) {
                return
            }

            // Determine rectangle on screen
            const hoverBoundingRect = ref.current?.getBoundingClientRect()

            // Get vertical middle
            const hoverMiddleY =
                (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2

            // Determine mouse position
            const clientOffset = monitor.getClientOffset()

            // Get pixels to the top
            const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top

            // Only perform the move when the mouse has crossed half of the items height
            // When dragging downwards, only move when the cursor is below 50%
            // When dragging upwards, only move when the cursor is above 50%

            // Dragging downwards
            if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
                return
            }

            // Dragging upwards
            if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
                return
            }

            // Time to actually perform the action
            console.log(`THE ITEM`)
            console.log(item)
            movePage(dragIndex, hoverIndex)

            // Note: we're mutating the monitor item here!
            // Generally it's better to avoid mutations,
            // but it's good here for the sake of performance
            // to avoid expensive index searches.
            item.index = hoverIndex
        },
    })

    const [{ isDragging, draggedItem }, drag] = useDrag({
        item: { type: ItemTypes.TOPIC_PAGE_ITEM, pageId: page.id, topicId: topicId.toLowerCase() },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
            draggedItem: !!monitor.getItem()
        })
    })

    drag(drop(ref))
    return (
            <div ref={ref} className={cn((isDragging) ? "dragging" : "")}>
                { (page.title && page.title.length > 0) ? capitalize_and_truncate(page.title) : "Untitled Page" }
            </div>
    )
}
