import React, {useRef, useState} from 'react'
import {AppState} from "../../redux";
import {connect} from "react-redux";
import {Peaker} from "../../redux/userSlice";
import "./peak-reading-list.scss"
import {message, Table} from "antd";
import {deleteFutureRead, FutureRead} from "../../redux/readingListSlice";
import PeakTagDisplay from "../../common/peak-tag-display/PeakTagDisplay";
import useAxios from "axios-hooks";
import {backend_host_address} from "../../constants/constants";

const PeakReadingList = (props: { user: Peaker, futureReads: FutureRead[], deleteFutureRead: (id: string) => void }) => {
    const { futureReads } = props;
    const [value, setValue] = useState('')

    const [{ data, loading, error }, deleteFutureReadItem] = useAxios(
        {
            baseURL: backend_host_address,
        },
        { manual: true }
    );

    const deleteReadingListItem = (itemId: string) => {
        deleteFutureReadItem({
            method: "DELETE",
            url: `/api/v1/users/${props.user.id}/future-reads/${itemId}`
        }).then(res => {
            props.deleteFutureRead(itemId)
            message.info("Deleted!")
        })
    };

    const columns = [
        {
            title: 'Page',
            dataIndex: 'title',
            key: 'page',
            ellipsis: true,
            render: (title: string, record: FutureRead) => <a target="_blank" href={record.url}>{(title === "-" ? record.url : title)}</a>,
        },
        {
            title: 'Topic',
            key: 'topic',
            dataIndex: 'topic_id',
            width: '250px',
            render: (topicId?: string) => {
                return (topicId == null) ? null : <PeakTagDisplay key={topicId} topicId={topicId}/>
            },
        },
        {
            title: 'Date Added',
            dataIndex: 'date_added',
            key: 'date_added',
            ellipsis: true,
            width: '200px',
            render: (date_added: string) => {
                const date = new Date(date_added)
                return (<span>{date.toLocaleString()}</span>)
            }
        },
        {
            title: 'Action',
            key: 'action',
            ellipsis: true,
            width: '100px',
            render: (futureRead: FutureRead) => <a onClick={() => {
                deleteReadingListItem(futureRead.id)
            }}>Delete</a>,
        },
    ];

    return (
        <div className="peak-reading-list-container">
            <h1>Reading List</h1>
            <Table
                columns={columns}
                dataSource={futureReads}
                className="reading-list-table"
                pagination={false}
                rowKey={(r: FutureRead) => r.id}
            />
        </div>
    )
};

const mapDispatchToProps = { deleteFutureRead };
const mapStateToProps = (state: AppState) => ({ user: state.user, futureReads: state.futureReads });
export default connect(mapStateToProps, mapDispatchToProps)(PeakReadingList);
