import React, {useEffect} from 'react'
import {PeakNote} from "../../../redux/slices/noteSlice";
import {loadPeakNotes, useNotes} from "../../../client/notes";
import {List, message, Popconfirm} from "antd";
import {BookOutlined, DeleteOutlined, ReadFilled} from "@ant-design/icons/lib";
import "./note-list-view.scss"
import {Link} from "react-router-dom";
import {deriveHostname} from "../../../utils/urls";
import { ELEMENT_PEAK_BOOK, ELEMENT_WEB_NOTE } from "../../../common/rich-text-editor/plugins/peak-knowledge-plugin/constants";
import {ImageLoader} from "../../../common/image-loader/ImageLoader";
import { capitalize } from 'lodash';
import {PeakTagDisplay} from "../../../common/peak-tag-display/PeakTagDisplay";
import {PeakKnowledgeKeyOption} from "../../../common/rich-text-editor/plugins/peak-knowledge-plugin/types";
import {buildNoteUrl} from "../../../utils/notes";
import {useCurrentUser} from "../../../utils/hooks";
import {DeleteNoteConfirm} from "../../../common/delete-note-popconfirm/DeleteNoteConfirm";

export const PeakBookListView = (props: { page_header: string, note_type: PeakKnowledgeKeyOption }) => {
    const { page_header, note_type } = props
    const currentUser = useCurrentUser()
    const notes: PeakNote[] = useNotes().filter(n => n.note_type === note_type)

    useEffect(() => {
        loadPeakNotes(currentUser.id)
    }, [])

    return (
        <div className={"notes-container"}>
            <h1 className={"peak-page-title"}>{capitalize(page_header)}</h1>
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
                renderItem={(item) => <NoteListItem item={item}/>}
            />
        </div>
    )
}

const NoteListItem = (props: { item: PeakNote }) => {
    const { item } = props
    return (
        <List.Item key={item.title}>
            <List.Item.Meta
                className={"peak-note-book-container"}
                avatar={ (item.note_type === ELEMENT_PEAK_BOOK ) ? <NoteAvatar item={item}/> : null }
                title={
                    <div className={"peak-note-list-item"}>
                        <div className={"title-container"}>
                            <Link to={buildNoteUrl(item.id)}>
                                <div className={"peak-note-list-item-header"}>
                                    <p className={"item-title"}>{capitalize(item.title)}</p>
                                    <NoteSubTitle item={item}/>
                                </div>
                            </Link>
                            <div className="peak-note-tag-section">
                                {item.tag_ids.map(id => <PeakTagDisplay key={id} tagId={id}/>)}
                            </div>
                        </div>
                        <NoteIconSection item={item}/>
                    </div>
                }
            />
        </List.Item>
    )
}

const NoteAvatar = (props: { item: PeakNote }) => {
    const { item } = props

    if (!item.cover_image_url) {
        return (<ReadFilled className="default-note-icon"/>)
    } else {
        return (
            <ImageLoader
                className="note-icon"
                url={item.cover_image_url}
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

const NoteIconSection = (props: { item: PeakNote }) => {
    const { item } = props
    const mockOut = () => {
        message.info("Not implemented yet")
    }
    return (
        <div className={"icon-section"}>
            <DeleteNoteConfirm item={item}/>
        </div>
    )
}