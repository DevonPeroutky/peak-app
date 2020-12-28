import axios from "axios";
import {
    sendCurrentPageToReadingListMessage,
    sendLinkToReadingListMessage,
    sendMessageToUser, sendNotificationToUser, sendOpenSavePageModalMessage
} from "./messageUtil";
import {Button, message, notification} from "antd";
import React from "react";
type Tab = chrome.tabs.Tab

// --------------------------------
// Pop off page
// --------------------------------
export const popOffPage = (userId: string, topicId: string = "random-topic-69") => {
    return chrome.tabs.query({active: true, currentWindow:true},
        function(tabs) {
            const activeTab: Tab = tabs[0];
            return axios.get(`http://localhost:4000/api/v1/users/${userId}/next-reading-list-item?topic_id=${topicId}`).then(r => {
                if (r.data.data != null) {
                    axios.put(`http://localhost:4000/api/v1/users/${userId}/future-reads/${r.data.data.id}/update-date-read`).then(r => {
                        chrome.tabs.create({ url: r.data.data.url });
                    });
                    sendNotificationToUser(activeTab, <Button type={"ghost"} onClick={message.warning("Unimplemented")}>Re-add to list</Button>)
                } else {
                    console.log("Nothing more to read!");
                    sendMessageToUser(activeTab, "You've read everything off your list!")
                }
            }).catch(err => {
                console.log("ERRORs!");
                sendMessageToUser(activeTab, "Looks like the server is having an issue!")
            })
        });
}

// --------------------------------
// Add Page/Link to Reading List
// --------------------------------
export function saveToReadingList(userId: string, info, tab) {
    if (info.linkUrl != null) {
        chrome.tabs.query({active: true, currentWindow:true},
            function(tabs) {
                const activeTab: Tab = tabs[0];
                sendLinkToReadingListMessage(activeTab, info.linkUrl, userId);
            });
    } else {
        chrome.tabs.query({active: true, currentWindow:true},
            function(tabs) {
                const activeTab: Tab = tabs[0];
                sendCurrentPageToReadingListMessage(userId, activeTab);
            });
    }
};

// --------------------------------
// Save Page to Personal Wiki
// --------------------------------
export function saveToWiki(userId: string) {
    console.log(`Saving to wiki!`);
    chrome.tabs.query({active: true, currentWindow:true},
        function(tabs) {
            const activeTab: Tab = tabs[0];
            sendOpenSavePageModalMessage(activeTab, userId);
    });
};