import {PeakTag} from "../../../../../types";
import {Link} from "react-router-dom";
import {CaretLeftFilled, ReadOutlined} from "@ant-design/icons/lib";
import {ImageLoader} from "../../../../../common/image-loader/ImageLoader";
import {Input} from "antd";
import {NoteTagSelect} from "../../../../../common/rich-text-editor/plugins/peak-knowledge-plugin/components/peak-knowledge-node/peak-tag-select/component/NoteTagSelect";
import React from "react";
import TextArea from "antd/es/input/TextArea";

export const BookHeaderSection = (props: {note_id: string, icon_url: string, selected_tags: PeakTag[], title: string, author: string, onAuthorChange, onTitleChange}) => {
    const { note_id, icon_url, title, author, onAuthorChange, onTitleChange, selected_tags } = props
    return (
        <div className={"note-header-section peak_book"}>
            <div className={"note-subheader-section"}>
                <Link to={`/home/books`}><CaretLeftFilled/> Back to Books</Link>
            </div>
            <div className={"book-note-header-row"}>
                <div className={"image-section"}>
                    <ImageLoader url={icon_url} className={"book-note-cover-image"} fallbackElement={<ReadOutlined className={"book-note-cover-image"}/>}/>
                </div>
                <div className={"note-header-section"}>
                    <div className={"note-header"}>
                        <TextArea autoSize={true} className={"book-title-input"} bordered={false} onChange={onTitleChange} value={title} placeholder="Add a book title"/>
                        <Input className={"author-subtitle"} bordered={false} onChange={onAuthorChange} value={author} placeholder="Add an Author"/>
                        <NoteTagSelect selected_tags={selected_tags} note_id={note_id}/>
                    </div>
                </div>
            </div>
        </div>
    )
}
