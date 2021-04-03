import React, {useCallback, useEffect, useMemo, useState} from "react";
import {useCurrentUser} from "../../utils/hooks";
import {PeakNote} from "../../redux/slices/noteSlice";
import {loadPeakNotes, useNotes} from "../../client/notes";
import {Empty, message, Popconfirm, Timeline} from "antd";
import { ELEMENT_WEB_NOTE } from "../../common/rich-text-editor/plugins/peak-knowledge-plugin/constants";
import {Link} from "react-router-dom";
import {buildNoteUrl} from "../../utils/notes";
import {PeakTagDisplay} from "../../common/peak-tag-display/PeakTagDisplay";
import {
    CalendarOutlined,
    DeleteOutlined,
    ReadFilled,
    UpCircleOutlined
} from "@ant-design/icons/lib";
import {ImageLoader} from "../../common/image-loader/ImageLoader";
import {deriveHostname} from "../../utils/urls";
import "./peak-timeline.scss"
import {formatStringAsDate} from "../../utils/time";
import { groupBy, head } from "ramda";
import cn from "classnames";
import { sort } from 'ramda';

const groupByDate = groupBy(function (note: PeakNote) {
    return formatStringAsDate(note.inserted_at)
})

const noteOrdering = (a: PeakNote, b: PeakNote) => {
    return (a.inserted_at <= b.inserted_at) ? 1 : -1
};

export const PeakTimeline = (props: { }) => {
    const currentUser = useCurrentUser()
    const notes: PeakNote[] = sort(noteOrdering, useNotes().filter(n => n.note_type === ELEMENT_WEB_NOTE))


    useEffect(() => {
        loadPeakNotes(currentUser.id)
    }, [])

    const groupedByDates = groupByDate(notes)
    const first_date = head(Object.keys(groupedByDates))
    const FINAL = "final"

    if (notes.length == 0) {
        return (
            <div className={"peak-timeline-container empty"}>
                <h1 className={"peak-page-title"}>No Bookmarks Yet</h1>
                <Empty description={"Download the chrome extension to get started!"}/>
            </div>
        )
    }
    return (
        <div className={"peak-timeline-container"}>
            <h1 className={"peak-page-title"}>Bookmarks</h1>
            <div className="timeline-container">
                <div className="vertical-bar"/>
                <Timeline className={"peak-note-timeline"}>
                    {
                        Object.entries({...groupedByDates, [FINAL]: []}).map(([date, notes]) => {
                            const isFirst = first_date === date

                            if ( date === FINAL ) {
                                return (
                                    <Timeline.Item key={"first-item"} className={"final-timeline-item"} dot={<UpCircleOutlined className={"timeline-icon"}/>}>
                                    </Timeline.Item>
                                )
                            }
                            return (
                                <>
                                    <Timeline.Item key={date} dot={dateTimelineIcon(isFirst)} className={cn("peak-timeline-date-item", (isFirst) ? "first" : "normal")}>
                                        {<h1>{date}</h1>}
                                    </Timeline.Item>
                                    {
                                        notes.map(n =>
                                            <Timeline.Item key={n.id} dot={<NoteAvatar item={n} />} className={"peak-timeline-item"}>
                                                <div className={"peak-timeline-item-body"}>
                                                    <a target="_blank" href={n.url} className={"subtitle"}>{deriveHostname(n.url)}</a>
                                                    <Link to={buildNoteUrl(n.id)}>
                                                        <span className={"title"}>{ n.title }</span>
                                                    </Link>
                                                    <div className="peak-note-tag-section">
                                                        {n.tag_ids.map(id => <PeakTagDisplay key={id} tagId={id}/>)}
                                                    </div>
                                                </div>
                                            </Timeline.Item>
                                        )
                                    }
                                </>
                            )
                        })
                    }
                </Timeline>
            </div>
        </div>
    )
}

const NoteAvatar = (props: { item: PeakNote }) => {
    const { item } = props

    if (!item.icon_url) {
        return (<ReadFilled className="default-note-icon"/>)
    } else {
        return (
            <ImageLoader
                className="timeline-icon"
                url={item.icon_url}
                fallbackElement={
                    <ReadFilled className="default-note-icon"/>
                }
            />
        )
    }
}


const NoteIconSection = (props: { item: PeakNote }) => {
    const { item } = props
    const mockOut = () => {
        message.info("Not implemented yet")
    }
    return (
        <div className={"icon-section"}>
            <Popconfirm title="Are you sure？" icon={<DeleteOutlined style={{ color: 'red' }}/>} onConfirm={mockOut}>
                <DeleteOutlined />
            </Popconfirm>
        </div>
    )
}

const dateTimelineIcon = (isFirst: boolean) => {
    return (isFirst) ? <CalendarOutlined className={"timeline-icon"} color={"#f0f0f0"}/> : <div className={"v-bar-icon"}/>
}