import React, {useCallback, useEffect, useMemo, useState} from "react";
import {useCurrentUser} from "../../utils/hooks";
import {PeakNote} from "../../redux/slices/noteSlice";
import {loadPeakNotes, useNotes} from "../../client/notes";
import { message, Popconfirm, Timeline } from "antd";
import { ELEMENT_WEB_NOTE } from "../../common/rich-text-editor/plugins/peak-knowledge-plugin/constants";
import {Link} from "react-router-dom";
import {buildNoteUrl} from "../../utils/notes";
import {PeakTagDisplay} from "../../common/peak-tag-display/PeakTagDisplay";
import {CalendarOutlined, DeleteOutlined, ReadFilled} from "@ant-design/icons/lib";
import {ImageLoader} from "../../common/image-loader/ImageLoader";
import {deriveHostname} from "../../utils/urls";
import "./peak-timeline.scss"
import {formatStringAsDate} from "../../utils/time";
import { groupBy } from "ramda";

const groupByDate = groupBy(function (note: PeakNote) {
    return formatStringAsDate(note.inserted_at)
})

const groupByRandomDate = groupBy(function (note: PeakNote) {
    function getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }

    return `2020-03-${getRandomInt(28)}`
})

export const PeakTimeline = (props: { }) => {
    const currentUser = useCurrentUser()
    const notes: PeakNote[] = useNotes().filter(n => n.note_type === ELEMENT_WEB_NOTE)


    useEffect(() => {
        loadPeakNotes(currentUser.id)
    }, [])

    const groupedByDates = groupByRandomDate(notes)

    return (
        <div className={"peak-timeline-container"}>
            <h1 className={"peak-page-title"}>Bookmarks</h1>
            <Timeline className={"peak-note-timeline"}>
                {
                    Object.entries(groupedByDates).map(([date, notes]) => {
                        console.log(`Date: `, date)
                        console.log(`Notes: `, notes)
                        return (
                            <>
                                <Timeline.Item key={date} dot={<div />} className={"peak-timeline-item"}>
                                    {<h1>{date}</h1>}
                                </Timeline.Item>
                                {
                                    notes.map(n =>
                                        <Timeline.Item key={n.id} dot={<NoteAvatar item={n} />} className={"peak-timeline-item"}>
                                            <div className={"peak-timeline-item-body"}>
                                                <span className={"subtitle"}>{deriveHostname(n.url)}</span>
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
                { notes.map(n =>
                    <Timeline.Item key={n.id} dot={<NoteAvatar item={n} />} className={"peak-timeline-item"}>
                        <div className={"peak-timeline-item-body"}>
                            <span className={"subtitle"}>{deriveHostname(n.url)}</span>
                            <Link to={buildNoteUrl(n.id)}>
                                <span className={"title"}>{ n.title }</span>
                            </Link>
                            <div className="peak-note-tag-section">
                                {n.tag_ids.map(id => <PeakTagDisplay key={id} tagId={id}/>)}
                            </div>
                        </div>
                    </Timeline.Item>
                )}
            </Timeline>
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
