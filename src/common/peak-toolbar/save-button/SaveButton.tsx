import { Button } from "antd";
import React, { useState } from "react";
import { useCurrentWikiPage, usePagePublisher } from '../../../utils/hooks';
import "./save-button.scss";
import {CheckOutlined} from "@ant-design/icons/lib";

interface SaveButtonProps {}
export const PublishButton = (props: SaveButtonProps) => {
    // CurrentPage saving state
    const currentWikiPage = useCurrentWikiPage();
    const publishPage = usePagePublisher();
    const content = (currentWikiPage.isSaving) ? "Saving" : "Publish";

    return (
        <Button
            ghost
            type="primary"
            loading={currentWikiPage.isSaving}
            onClick={() => publishPage()}
            icon={<CheckOutlined/>}
            className={"editing-save-button animated"}
            size={"small"}>
            {content}
        </Button>
    )
};