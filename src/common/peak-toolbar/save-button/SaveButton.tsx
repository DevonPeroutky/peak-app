import { Button } from "antd";
import React from "react";
import { usePagePublisher } from '../../../utils/hooks';
import "./save-button.scss";
import {CheckOutlined} from "@ant-design/icons/lib";
import {useActiveEditorState} from "../../../redux/slices/activeEditor/activeEditorSlice";

interface SaveButtonProps {}
export const PublishButton = (props: SaveButtonProps) => {
    // CurrentPage saving state
    const editorState = useActiveEditorState()
    const publishPage = usePagePublisher();
    const content = (editorState.isSaving) ? "Saving" : "Publish";

    return (
        <Button
            ghost
            type="primary"
            loading={editorState.isSaving}
            onClick={() => publishPage()}
            icon={<CheckOutlined/>}
            className={"editing-save-button animated"}
            size={"small"}>
            {content}
        </Button>
    )
};