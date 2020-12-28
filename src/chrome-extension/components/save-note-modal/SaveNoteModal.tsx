import {Button, Modal} from "antd";
import React, {useState} from "react";
import {HeartOutlined} from '@ant-design/icons';
import 'antd/lib/modal/style/index.css';

const { confirm } = Modal;
export function showSaveNoteModal() {
    confirm({
        className: "save-notes-modal",
        title: 'Save notes!',
        zIndex: 2147483646,
        icon: <HeartOutlined twoToneColor={"blue"}/>,
        content: 'Put the Rich Text Editor here!',
        okText: 'Submit',
        onOk() {
            return new Promise((resolve, reject) => {
                setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
            }).catch(() => console.log('Oops errors!'));
        },
        onCancel() {},
    });
}

export const SaveNoteModal = (props: {}) => {
    const [isVisible, setVisibility] = useState(false)

    return (
        <div>
            <Button onClick={() => setVisibility(true)} type={"ghost"}>Show Modal</Button>
            <Modal
                title="Title"
                visible={isVisible}
                zIndex={2147483646}
                forceRender={true}
                onOk = { () => {
                    return new Promise((resolve, reject) => {
                        setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
                    }).catch(() => console.log('Oops errors!'));
                }}
                onCancel = { () => setVisibility(false)}>
                <p>HEllo</p>
            </Modal>
        </div>
    )

}