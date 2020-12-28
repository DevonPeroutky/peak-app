/*global chrome*/
import React from 'react';
import "./content.scss";
import {Button, message, Modal, notification, Spin} from 'antd';
import 'antd/lib/button/style/index.css';
import 'antd/lib/message/style/index.css';
import 'antd/lib/notification/style/index.css';
// import 'antd/dist/antd.css';

import { DeleteTwoTone, ReadOutlined } from '@ant-design/icons';
import {
    AddPageMessage,
    ChromeExtMessage,
    MessageType,
    SavePageMessage,
    UserMessage,
    UserNotification
} from "../utils/constants/models";
import {TopicSearchInput} from "../components/topic-search-input/TopicSearchInput";
import axios from "axios";
import { showSaveNoteModal } from "../components/save-note-modal/SaveNoteModal";
const R = require('ramda');

// ---------------------------------------------------
// 'Global' state
// ---------------------------------------------------
var isVisible = false;

// ---------------------------------------------------
// Event Handlers
// ---------------------------------------------------
const updateFutureReadWithTopic = (userId: string, futureReadId: string, topic: string, key: string) => {
    notification.info({
        message: 'Saving...',
        icon: <Spin/>,
        className: "save-to-peak-notification",
        key,
        duration: 0
    });

    axios.put(
        `http://localhost:4000/api/v1/users/${userId}/future-reads/${futureReadId}`,
        {
            "future": {
                "topic_id": topic
            }
        }).then(r => {
            notification.success({
                message: 'Saved to Reading List!',
                className: "save-to-peak-notification",
                key,
                duration: 2
            });
        })
};

const deleteFutureRead = (userId: string, futureReadId: string, key: string) => {
    notification.warning({
        message: 'Removing...',
        icon: <Spin/>,
        className: "save-to-peak-notification",
        key,
        duration: 0,
    });

    axios.delete(`http://localhost:4000/api/v1/users/${userId}/future-reads/${futureReadId}`).then(r => {
        notification.warning({
            message: 'Removed from Reading List!',
            className: "save-to-peak-notification",
            key,
            duration: 3,
        });
    });
}

const saveToReadingList = (title: string, url: string, userId: string) => {
    var topicId = "";
    const key = `added-to-reading-list`;

    notification.info({
        message: 'Adding...',
        icon: <Spin/>,
        className: "save-to-peak-notification",
        key,
        duration: 0,
    });

    const descriptionNew = (futureReadId: string) => {
        const updateTopicSelection = R.partial((userId, futureReadId: string, newTopicId: string) => {
            topicId = newTopicId;
            updateFutureReadWithTopic(userId, futureReadId, topicId, key);
        }, [userId, futureReadId]);

        return (<div className={"add-topic-body"}>
            <TopicSearchInput userId={userId} onSelection={updateTopicSelection}/>
            <div className={"button-row"}>
                <Button
                    type={"primary"}
                    className={"save-no-topic-button"}
                    icon={<ReadOutlined twoToneColor="white"/>}
                    onClick={() => {notification.close(key)}}>Save without a Topic</Button>
                <Button ghost type={"danger"} onClick={() => deleteFutureRead(userId, futureReadId, key)} icon={<DeleteTwoTone twoToneColor="red"/>}>Discard</Button>
            </div>
        </div>)
    };

    const descriptionAlreadyAdded = (futureReadId: string) => {
        return (<div className={"add-topic-body"}>
            <div className={"button-row"}>
                <Button ghost type={"danger"} onClick={() => deleteFutureRead(userId, futureReadId, key)} icon={<DeleteTwoTone twoToneColor="red"/>}>Remove Page</Button>
            </div>
        </div>)
    };

    axios.post(
        `http://localhost:4000/api/v1/users/${userId}/future-reads`,
        {
            "future": {
                "title": title || url,
                "url": url,
                "content_type": "page",
                "topic_id": null
            }
        }).then(r => {
            console.log(r.data);
            console.log(r.data.data);
            notification.success({
                message: 'Saved to Reading List!',
                className: "save-to-peak-notification",
                description: descriptionNew(r.data.data.id),
                key,
                duration: 10
            });
        }).catch(err => {
            console.log(err)
            console.log(err.response.data)
            console.log(err.response.data.errors)
            console.log(err.response.data.errors.user_url_unique_constraint)

            if (err.response.data && err.response.data.errors && err.response.data.errors.user_url_unique_constraint) {
                notification.info({
                    message: 'You have already added this page!',
                    className: "save-to-peak-notification",
                    key,
                    duration: 3
                });
            } else {
                notification.error({
                    message: 'Error saving to Reading List!',
                    className: "save-to-peak-notification",
                    description: <span>Please contact us and let us know the issue!</span>,
                    key,
                    duration: 10
                });
            }
        });
};

// ---------------------------------------------------
// Listen for Messages
// ---------------------------------------------------
chrome.runtime.onMessage.addListener(
    function(request: ChromeExtMessage, sender, sendResponse) {
        console.log(`Received Message: ${request.message_type}`);
        switch (request.message_type) {
            case MessageType.AddToReadingList:
                const addRequest: AddPageMessage = request as AddPageMessage;
                saveToReadingList(addRequest.title, addRequest.link, addRequest.user_id);
                break;
            case MessageType.Message_User:
                const messageRequest: UserMessage = request as UserMessage;
                message.info(messageRequest.message);
                break;
            case MessageType.Notify_User:
                const notifyRequest: UserNotification = request as UserNotification;
                notification.success({
                    message: 'Cheers to reading more!',
                    className: "save-to-peak-notification",
                    description: notifyRequest.message,
                    key: "unpop",
                    duration: 0,
                });
                break;
            case MessageType.SaveToPeak:
                console.log(`Opening the modal!`)
                const openSaveModalRequest: SavePageMessage = request as SavePageMessage;
                showSaveNoteModal();
                break;
        }
    }
);

// ---------------------------------------------------
// Mount to Node
// ---------------------------------------------------
// const app = document.createElement('div');
// app.id = "my-extension-root";
// document.body.appendChild(app);
// ReactDOM.render(<SaveNoteModal/>, app);