import React from "react";
import {LineOutlined} from "@ant-design/icons/lib";
import {ELEMENT_DIVIDER} from "./defaults";
import {PeakEditorControlDisplay} from "../../../peak-toolbar/toolbar-controls";

export const PEAK_DIVIDER: PeakEditorControlDisplay = {
    controlType: "block",
    icon: <LineOutlined className={"peak-editor-control-icon"}/>,
    description: "Separate content with a horizontal line",
    label: "Divider",
    elementType: ELEMENT_DIVIDER,
};