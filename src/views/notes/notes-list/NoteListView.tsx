import React from 'react'
import {PeakNote} from "../../../redux/slices/noteSlice";
import {useNotes} from "../../../client/notes";
import {List} from "antd";
import {BookOutlined, DeleteOutlined, ReadFilled} from "@ant-design/icons/lib";
import "./note-list-view.scss"
import {Link} from "react-router-dom";
import {deriveHostname} from "../../../utils/urls";
import {
    ELEMENT_PEAK_BOOK,
    ELEMENT_WEB_NOTE
} from "../../../common/rich-text-editor/plugins/peak-knowledge-plugin/constants";
import {ImageLoader} from "../../../common/image-loader/ImageLoader";
import { capitalize } from 'lodash';
import {PeakTagDisplay} from "../../../common/peak-tag-display/PeakTagDisplay";
import {PeakKnowledgeKeyOption} from "../../../common/rich-text-editor/plugins/peak-knowledge-plugin/types";
const bookmark = require('../../../assets/icons/bookmark.svg');

export const PeakNoteListView = (props: { page_header: string, note_type: PeakKnowledgeKeyOption }) => {
    const { page_header, note_type } = props
    const notes: PeakNote[] = useNotes().filter(n => n.note_type === note_type)

    return (
        <div className={"notes-container"}>
            <h1>{capitalize(page_header)}</h1>
            <List
                className={"peak-notes-list"}
                itemLayout={"vertical"}
                size={"large"}
                pagination={{
                    onChange: (page) => {
                        console.log(page);
                    },
                    pageSize: 10
                }}
                dataSource={notes}
                renderItem={(item) => (item.note_type === ELEMENT_WEB_NOTE) ? <WebNoteListItem item={item}/> : <BookListItem item={item}/>}
            />
        </div>
    )
}

const WebNoteListItem = (props: { item: PeakNote }) => {
    const { item } = props
    return (
        <List.Item key={item.title}>
            <List.Item.Meta
                className={"peak-note-meta-container"}
                avatar={null}
                title={
                    <>
                        <Link to={`/home/notes/${item.id}`}>
                            <div className={"peak-note-list-item-header"}>
                                <NoteSubTitle item={item}/>
                                <span className={"item-title"}>
                                                {capitalize(item.title)}
                                            </span>
                            </div>
                        </Link>
                    </>
                }
                description={
                    <div className="peak-note-tag-section">
                        {item.tag_ids.map(id => <PeakTagDisplay key={id} tagId={id}/>)}
                    </div>
                }
            />
        </List.Item>
    )
}

const BookListItem = (props: { item: PeakNote }) => {
    const { item } = props
    return (
        <List.Item key={item.title}>
            <List.Item.Meta
                className={"peak-note-book-container"}
                avatar={<NoteAvatar item={item}/>}
                title={
                    <>
                            <div className={"peak-note-list-item"}>
                                    <div className={"title-container"}>
                                        <Link to={`/home/notes/${item.id}`}>
                                            <span className={"item-title"}>{capitalize(item.title)}</span>
                                        </Link>
                                        <NoteSubTitle item={item}/>
                                    </div>
                                <div className={"icon-section"}>
                                    <div className="peak-note-tag-section">
                                        {item.tag_ids.map(id => <PeakTagDisplay key={id} tagId={id}/>)}
                                    </div>
                                    <DeleteOutlined />
                                </div>
                            </div>
                    </>
                }
            />
        </List.Item>
    )
}

const NoteAvatar = (props: { item: PeakNote }) => {
    const { item } = props

    if (item.note_type === ELEMENT_WEB_NOTE) {
        return (<img src={bookmark} className={"web-note-icon"}/>)
    }

    if (!item.icon_url) {
        return (<ReadFilled className="default-note-icon"/>)
    } else {
        return (
            <ImageLoader
                className="note-icon"
                url={item.icon_url}
                fallbackElement={
                    <ReadFilled className="default-note-icon"/>
                }
            />
        )
    }
}

const NoteSubTitle = (props: { item: PeakNote }) => {
    const { item } = props
    return (
       <div className={"subtitle-container"}>
           {(item.note_type === ELEMENT_WEB_NOTE) ?
               <>
                   <ImageLoader className={"fav-icon"} url={item.icon_url} fallbackElement={<BookOutlined className="default-note-icon"/>}/>
                   <span>{deriveHostname(item.url)}</span>
               </>
               : item.author}
       </div>
    )
}