import {TopicHeaderRow} from "../topic-header-row/TopicHeaderRow";
import {capitalize_and_truncate} from "../../../../utils/strings";
import React  from "react";
import {useCurrentPageId, useCurrentUser} from "../../../../utils/hooks";
import {PeakPage, PeakTopic} from "../../../../redux/slices/topicSlice";
import {DropTargetMonitor, useDrag, useDrop} from "react-dnd";
import cn from "classnames";
import {useHistory} from "react-router-dom";
import "./topic-page-group.scss"
import { useMovePageToNewTopic } from "../../../../utils/topics";

export const DragItemTypes = {
    TOPIC_PAGE_ITEM: 'topic_page_item',
    TOPIC_HEADER: 'topic_header'
}
interface DragItem {
    index: number
    id: string
    topicId: string
    pageId: string
    type: string
}

export const TopicSection = (props: {topics: PeakTopic[]}) => {
    const { topics } = props
    return (
        <div className={"topic-group-container"}>
            {topics.map(topic => <TopicPageGroup key={topic.id} topic={topic}/>)}
        </div>
    )
}

const TopicPageGroup = (props: { topic: PeakTopic }) => {
    const { topic } = props
    const user = useCurrentUser()
    const movePageToNewTopic = useMovePageToNewTopic()

    const [{canDrop, isOver}, drop] = useDrop(() => ({
        accept: DragItemTypes.TOPIC_PAGE_ITEM,
        drop(item: DragItem, monitor: DropTargetMonitor) {
            if (item.topicId === topic.id) {
                console.log(`Do nothing`)
            } else {
                console.log(`Moving: ${item.pageId} to ${topic.name}`)
                movePageToNewTopic(item.pageId, item.topicId, topic.id)
            }
        },
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
            canDrop: monitor.canDrop(),
        })
    }))

    return (
        <div ref={drop} key={topic.id.toLowerCase()} className={cn("topic-group", (isOver) ? "hovering" : "")}>
            <TopicHeaderRow topic={topic} user={user}/>
            {topic.pages.map((page, i) =>
                <TopicPageRow key={page.id} page={page} topicId={topic.id} index={i}/>
            )}
        </div>
    )
}
const TopicPageRow = (props: {page: PeakPage, topicId: string, index: number}) => {
    const { page, topicId } = props
    const currentPageId = useCurrentPageId();
    const history = useHistory();

    // const [{dropResult, canDrop}, drop] = useDrop({
    //     accept: DragItemTypes.TOPIC_PAGE_ITEM,
    //     hover(item: DragItem, monitor: DropTargetMonitor) {
    //         if (!ref.current) {
    //             return
    //         }
    //         const dragIndex = item.index
    //         const hoverIndex = index
    //
    //         // Don't replace items with themselves
    //         if (dragIndex === hoverIndex) {
    //             return
    //         }
    //
    //         // Determine rectangle on screen
    //         const hoverBoundingRect = ref.current?.getBoundingClientRect()
    //
    //         // Get vertical middle
    //         const hoverMiddleY =
    //             (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
    //
    //         // Determine mouse position
    //         const clientOffset = monitor.getClientOffset()
    //
    //         // Get pixels to the top
    //         const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top
    //
    //         // Only perform the move when the mouse has crossed half of the items height
    //         // When dragging downwards, only move when the cursor is below 50%
    //         // When dragging upwards, only move when the cursor is above 50%
    //
    //         // Dragging downwards
    //         if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
    //             return
    //         }
    //
    //         // Dragging upwards
    //         if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
    //             return
    //         }
    //
    //         // Time to actually perform the action
    //         movePage(dragIndex, hoverIndex)
    //
    //         // Note: we're mutating the monitor item here!
    //         // Generally it's better to avoid mutations,
    //         // but it's good here for the sake of performance
    //         // to avoid expensive index searches.
    //         item.index = hoverIndex
    //     },
    // })

    const [{ isDragging }, drag] = useDrag({
        item: { type: DragItemTypes.TOPIC_PAGE_ITEM, pageId: page.id, topicId: topicId.toLowerCase() },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
            draggedItem: !!monitor.getItem(),
        })
    })

    const selected = currentPageId === page.id
    return (
        <div ref={drag} onClick={() => history.push(`/topic/${topicId.toLowerCase()}/wiki/${page.id}`)} className={cn("topic-page-item", (isDragging) ? "dragging" : "", (selected) ? "selected" : "")}>
            <span className={"topic-page-item-link"}>{ (page.title && page.title.length > 0) ? capitalize_and_truncate(page.title) : "Untitled Page" }</span>
        </div>
    )
}
