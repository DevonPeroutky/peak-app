import * as React from "react";
import {notification, Spin} from "antd";
import "./save-page-message.scss";
import {SavePageHeaderContent, SavingLoader} from "./components/save-page-header-content/SavePageHeaderContent";
import {SavePageContent} from "./components/save-page-content/SavePageContent";
import {PeakTag} from "../../../../types";

notification.config({
    placement: 'topRight',
    top: 0,
    duration: 0,
    rtl: false,
});

interface SavedPageStateProps {
    editing: boolean,
    saving: boolean,
}

export interface SavedPageContentProps {
    pageTitle: string,
    favIconUrl: string,
    tags: PeakTag[]
}

export interface SavedPageProps extends SavedPageContentProps, SavedPageStateProps { closeDrawer: () => void };

export const openEditingNotification = (props: SavedPageProps) => {
    const { saving, editing } = props
    const sup = {...props, editing: true}
    notification.open({
        message: <SavePageHeaderContent saving={saving}/>,
        className: 'saved-page-message drawer-mode',
        duration: 0,
        key: "saved-page-message",
        description: <SavePageContent {...sup} />,
        onClick: () => {
            console.log('Notification Clicked!');
        },
    });
};

// export const openSavingNotification = (props: SavedPageProps) => {
//     notification.open({
//         message: <SavePageHeaderContent saving={true}/>,
//         className: 'saved-page-message',
//         duration: 0,
//         key: "saved-page-message",
//         description: <SavePageContent editing={false} {...props}/>,
//         onClick: () => {
//             console.log('Notification Clicked!');
//         },
//     });
// };

export const openSavedPageMessage = (props: SavedPageProps) => {
    const { saving, editing } = props
    notification.open({
        message: <SavePageHeaderContent saving={saving}/>,
        className: 'saved-page-message',
        duration: 0,
        key: "saved-page-message",
        description: <SavePageContent editing={editing} {...props}/>,
        onClick: () => {
            console.log('Notification Clicked!');
        },
    });
};