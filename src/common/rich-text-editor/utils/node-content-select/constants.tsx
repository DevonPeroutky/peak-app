import React from "react";
import {PeakNodeSelectListItem} from "./types";
import {ELEMENT_PEAK_BOOK} from "../../plugins/book-plugin/defaults";
import {insertCustomBlockElement} from "../base-utils";
import {PEAK_LEARNING} from "../../plugins/peak-learning-plugin/defaults";
import {ReadOutlined} from "@ant-design/icons/lib";

export const BASIC_LIBRARY: PeakNodeSelectListItem[] = [
    {
        title: "Chaos Monkeys",
        label: "Chaos Monkeys",
        elementType: ELEMENT_PEAK_BOOK,
        customFormat: (editor => insertCustomBlockElement(editor, ELEMENT_PEAK_BOOK)),
        icon: <ReadOutlined className={"inline-select-item-icon"}/>
    },
    {
        title: "General Magic",
        label: "General Magic",
        elementType: ELEMENT_PEAK_BOOK,
        customFormat: (editor => insertCustomBlockElement(editor, ELEMENT_PEAK_BOOK)),
        icon: <ReadOutlined className={"inline-select-item-icon"}/>
    }
]

export function createCreateNewBookListItem(currSearch: string): PeakNodeSelectListItem {
    return {
        title: currSearch,
        label: `Create new book: ${currSearch}`,
        elementType: ELEMENT_PEAK_BOOK,
        customFormat: (editor => insertCustomBlockElement(editor, ELEMENT_PEAK_BOOK)),
        icon: <ReadOutlined className={"inline-select-item-icon"}/>
    }
}
