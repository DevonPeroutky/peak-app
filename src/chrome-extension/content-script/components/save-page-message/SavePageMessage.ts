import {notification} from "antd";
import "./save-page-message.scss";

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
        message: 'Saving...',
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

export const openSavedNotification = () => {
    notification.config({
        placement: 'topRight',
        top: 0,
        duration: 0,
        rtl: false,
    });
    notification.open({
        message: 'Saved!!!',
        className: 'saved-page-message drawer-mode',
        duration: 0,
        key: "saved-page-message",
        description:
            'This is the content of the notification. This is the content of the notification. This is the content of the notification.',
        onClick: () => {
            console.log('Notification Clicked!');
        },
    });
};