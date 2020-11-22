import {Menu} from "antd";
import {TopicHeaderRow} from "../topic-header-row/TopicHeaderRow";
import {capitalize_and_truncate} from "../../../../utils/strings";
import React, {useCallback, useRef, useState} from "react";
import {useCurrentPageId, useCurrentUser} from "../../../../utils/hooks";
import "./topic-page-group.scss"
import {PeakPage, PeakTopic, topicPageOrdering} from "../../../../redux/topicSlice";
import {DropTargetMonitor, useDrag, useDrop, XYCoord} from "react-dnd";
import cn from "classnames";
import update from 'immutability-helper';
import { sort } from 'ramda';
import {Link, useHistory} from "react-router-dom";

export const DragItemTypes = {
    TOPIC_PAGE_ITEM: 'topic_page_item',
    TOPIC_HEADER: 'topic_header'
}

export const TopicPageGroup = (props: {topics: PeakTopic[]}) => {
    const { topics } = props
    const topicRef = useRef<HTMLDivElement>(null)
    const user = useCurrentUser()
    const [topicList, setTopicList] = useState<PeakTopic[]>(topics)


    const [, drop] = useDrop({
        accept: DragItemTypes.TOPIC_PAGE_ITEM,
        hover(item: DragItem, monitor: DropTargetMonitor) {
            console.log(`HOVERING`)
            console.log(item)
        },
    })

    // ASSUME we have a `BLESSED` list of topics
    const [pages, setPages] = useState<PeakPage[]>(sort(topicPageOrdering, topics.flatMap(t => t.pages)))

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
        <div className={"topic-group-container"}>
            {topics.map(topic =>
                // @ts-ignore
                <div key={topic.id.toLowerCase()} className={"topic-group"}>
                    <TopicHeaderRow topic={topic} user={user}/>
                    {topic.pages.map((page, i) =>
                        <TopicPageRow key={page.id} page={page} topicId={topic.id} index={i} movePage={movePageToDifferentTopic}/>
                    )}
                </div>
            )}
        </div>
    )
}

interface DragItem {
    index: number
    id: string
    type: string
}
const TopicPageRow = (props: {page: PeakPage, topicId: string, index: number, movePage: (dragIndex: number, hoverIndex: number) => void}) => {
    const { page, topicId, index, movePage } = props
    const currentPageId = useCurrentPageId();
    const history = useHistory();
    const ref = useRef<HTMLDivElement>(null)

    const [{dropResult, canDrop}, drop] = useDrop({
        accept: DragItemTypes.TOPIC_PAGE_ITEM,
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
        item: { type: DragItemTypes.TOPIC_PAGE_ITEM, pageId: page.id, topicId: topicId.toLowerCase() },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
            draggedItem: !!monitor.getItem(),
        })
    })

    drag(drop(ref))

    const selected = currentPageId === page.id
    return (
        <div ref={ref} onClick={() => history.push(`/topic/${topicId.toLowerCase()}/wiki/${page.id}`)} className={cn("topic-page-item", (isDragging) ? "dragging" : "", (selected) ? "selected" : "")}>
            <span className={"topic-page-item-link"}>{ (page.title && page.title.length > 0) ? capitalize_and_truncate(page.title) : "Untitled Page" }</span>
        </div>
    )
}
