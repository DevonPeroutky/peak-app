import React from 'react'
import {PeakNote} from "../../../redux/slices/noteSlice";
import {useNotes} from "../../../client/notes";
import {Avatar, List, Menu} from "antd";
import {ReadFilled} from "@ant-design/icons/lib";
import "./note-list-view.scss"
import {Link} from "react-router-dom";
import {deriveBaseDomain, deriveHostname} from "../../../utils/urls";
import {ELEMENT_WEB_NOTE} from "../../../common/rich-text-editor/plugins/peak-knowledge-plugin/constants";
import {ImageLoader} from "../../../common/image-loader/ImageLoader";
import { capitalize } from 'lodash';

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
                            avatar={(item.icon_url) ? <ImageLoader className="note-icon" url={item.icon_url} fallbackElement={<ReadFilled className="default-note-icon"/>}/> : <ReadFilled className="default-note-icon"/>}
                            title={
                                <Link to={`/home/notes/${item.id}`}>
                                    {capitalize(item.title)}
                                </Link>
                            }
                            description={(item.note_type === ELEMENT_WEB_NOTE) ? deriveHostname(item.url) : item.author.split(" ").map(capitalize).join(" ")}
                        />
                    </List.Item>
                )}
            />
        </div>
    )
}