import React from 'react'
import {PeakNote} from "../../../redux/slices/noteSlice";
import {useNotes} from "../../../client/notes";
import {List} from "antd";
import {BookOutlined, ReadFilled} from "@ant-design/icons/lib";
import "./note-list-view.scss"
import {Link} from "react-router-dom";
import {deriveHostname} from "../../../utils/urls";
import {ELEMENT_WEB_NOTE} from "../../../common/rich-text-editor/plugins/peak-knowledge-plugin/constants";
import {ImageLoader} from "../../../common/image-loader/ImageLoader";
import { capitalize } from 'lodash';
import {PeakTagDisplay} from "../../../common/peak-tag-display/PeakTagDisplay";
const bookmark = require('../../../assets/icons/bookmark.svg');

export const PeakNoteListView = (props: {}) => {
    const notes: PeakNote[] = useNotes()

    return (
        <div className={"notes-container"}>
            <h1>Notes</h1>
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
                renderItem={(item) => (
                    <List.Item key={item.title}>
                        <List.Item.Meta
                            className={"peak-note-meta-container"}
                            avatar={<NoteAvatar item={item}/>}
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
                                    {item.tag_ids.map(id => <PeakTagDisplay tagId={id}/>)}
                                </div>
                            }
                        />
                    </List.Item>
                )}
            />
        </div>
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