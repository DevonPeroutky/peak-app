import React from "react";
import {PeakNodeSelectListItem} from "./types";
import {insertCustomBlockElementCallback} from "../base-utils";
import {ReadOutlined} from "@ant-design/icons/lib";
import {ELEMENT_PEAK_BOOK} from "../../plugins/peak-knowledge-plugin/constants";

export function createCreateNewBookListItem(currSearch: string): PeakNodeSelectListItem {
    return {
        title: currSearch,
        label: `Create new book: ${currSearch}`,
        knowledgeNodeId: "-1",
        elementType: ELEMENT_PEAK_BOOK,
        customFormat: (editor => insertCustomBlockElementCallback(ELEMENT_PEAK_BOOK,{knowledgeNodeId: "-1", title: currSearch})(editor)),
        icon: <ReadOutlined className={"inline-select-item-icon"}/>
    }
}
