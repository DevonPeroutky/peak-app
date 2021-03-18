import * as React from "react";
import {notification, Spin} from "antd";
import "./save-page-message.scss";
import {SavePageHeaderContent, SavingLoader} from "./components/save-page-header-content/SavePageHeaderContent";

notification.config({
    placement: 'topRight',
    top: 0,
    duration: 0,
    rtl: false,
});

export const openEditingNotification = () => {
    notification.open({
        message: 'Notification Title',
        className: 'saved-page-message',
        duration: 0,
        key: "saved-page-message",
        description:
            'This is the content of the notification. This is the content of the notification. This is the content of the notification.',
        onClick: () => {
            console.log('Notification Clicked!');
        },
    });
};

export const openSavingNotification = () => {
    notification.open({
        message: <SavePageHeaderContent saving={true}/>,
        className: 'saved-page-message',
        duration: 0,
        key: "saved-page-message",
        description: <SavingLoader/>,
        onClick: () => {
            console.log('Notification Clicked!');
        },
    });
};

export const openSavedNotification = () => {
    notification.open({
        message: <SavePageHeaderContent saving={false}/>,
        className: 'saved-page-message',
        duration: 0,
        key: "saved-page-message",
        description: <SavingLoader/>,
        onClick: () => {
            console.log('Notification Clicked!');
        },
    });
};