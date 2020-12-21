import React from "react";
import {PeakNodeSelectListItem} from "./types";
import {ELEMENT_PEAK_BOOK} from "../../plugins/peak-book-plugin/defaults";
import {insertCustomBlockElement, insertCustomBlockElementCallback} from "../base-utils";
import {ReadOutlined} from "@ant-design/icons/lib";

export const BASIC_LIBRARY: PeakNodeSelectListItem[] = [
    {
        title: "Chaos Monkeys",
        label: "Chaos Monkeys",
        knowledgeNodeId: "69",
        elementType: ELEMENT_PEAK_BOOK,
        customFormat: (editor => insertCustomBlockElement(editor, ELEMENT_PEAK_BOOK, {knowledgeNodeId: "69", title: "Chaos Monkeys"})),
        icon: <ReadOutlined className={"inline-select-item-icon"}/>
    },
    {
        title: "General Magic",
        label: "General Magic",
        knowledgeNodeId: "420",
        elementType: ELEMENT_PEAK_BOOK,
        customFormat: (editor => insertCustomBlockElement(editor, ELEMENT_PEAK_BOOK, {knowledgeNodeId: "69", title: "General Magic"})),
        icon: <ReadOutlined className={"inline-select-item-icon"}/>
    }
]

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
