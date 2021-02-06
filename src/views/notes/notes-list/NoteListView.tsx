import React from 'react'
import {PeakNote} from "../../../redux/slices/noteSlice";
import {useNotes} from "../../../client/notes";
import {Avatar, List, Menu} from "antd";
import {ReadFilled} from "@ant-design/icons/lib";
import "./note-list-view.scss"
import {Link} from "react-router-dom";

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
                            avatar={(item.icon_url) ? <Avatar className="note-icon" src={item.icon_url} /> : <ReadFilled className="default-note-icon"/>}
                            title={
                                <Link to={`/home/notes/${item.id}`}>
                                    {item.title}
                                </Link>
                            }
                            description={item.author}
                        />
                    </List.Item>
                )}
            />
        </div>
    )
}