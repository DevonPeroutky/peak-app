import React from 'react'
import "./peak-reading-list.scss"
import {message, Table} from "antd";
import {deleteFutureRead, FutureRead} from "../../redux/slices/readingListSlice";
import PeakTagDisplay from "../../common/peak-tag-display/PeakTagDisplay";
import {useCurrentUser, useFutureReads} from "../../utils/hooks";
import {Peaker} from "../../redux/slices/userSlice";
import peakAxiosClient from "../../client/axiosConfig"

const PeakReadingList = (props: { }) => {
    const user: Peaker = useCurrentUser()
    const futureReads: FutureRead[] = useFutureReads()

    const deleteReadingListItem = (itemId: string) => {
        peakAxiosClient.delete(`/api/v1/users/${user.id}/future-reads/${itemId}`).then(res => {
            deleteFutureRead(itemId)
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

export default PeakReadingList;
