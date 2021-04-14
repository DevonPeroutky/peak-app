import {
    ELEMENT_BLOCKQUOTE,
    ELEMENT_CODE_BLOCK,
    ELEMENT_H1,
    ELEMENT_H2,
    ELEMENT_H3,
    ELEMENT_H4,
    ELEMENT_H5,
    ELEMENT_IMAGE, ELEMENT_LI,
    ELEMENT_LINK,
    ELEMENT_OL,
    ELEMENT_PARAGRAPH,
    ELEMENT_UL,
    MARK_BOLD,
    MARK_CODE,
    MARK_ITALIC,
    MARK_STRIKETHROUGH,
    MARK_UNDERLINE, SPEditor,
    toggleList,
    toggleMark,
} from "@udecode/slate-plugins";
import React, {ReactNode} from "react";
import {
    BoldOutlined,
    CodeOutlined,
    HighlightOutlined,
    InfoCircleOutlined,
    ItalicOutlined,
    LinkOutlined,
    MinusOutlined,
    OrderedListOutlined,
    PictureOutlined,
    RightOutlined,
    StrikethroughOutlined,
    TableOutlined,
    UnderlineOutlined,
    UnorderedListOutlined,
    BookOutlined,
    ReadOutlined,
    BulbOutlined
} from "@ant-design/icons/lib";
import { Icon, InlineIcon } from '@iconify/react';
import headingH1 from '@iconify/icons-gridicons/heading-h1';
import headingH2 from '@iconify/icons-gridicons/heading-h2';
import headingH3 from '@iconify/icons-gridicons/heading-h3';
import headingH4 from '@iconify/icons-gridicons/heading-h4';
import headingH5 from '@iconify/icons-gridicons/heading-h5';
import {message} from "antd";
import {Editor, Transforms} from "slate";
import {DIVIDER} from "../rich-text-editor/types";
import {PEAK_CALLOUT} from "../rich-text-editor/plugins/peak-callout-plugin/defaults";
import {insertCustomBlockElement} from "../rich-text-editor/utils/base-utils";
import {PeakNodeSelectListItem} from "../rich-text-editor/utils/node-content-select/types";
import {convertEditorControlDisplayToNodeSelectListItem} from "../rich-text-editor/utils/node-content-select/utils";
import {PEAK_LEARNING, PEAK_BOOK_SELECT_ITEM} from "../rich-text-editor/plugins/peak-knowledge-plugin/constants";
import {defaultOptions} from "../rich-text-editor/options";
import {PEAK_MEDIA_EMBED_CONTROLS} from "../rich-text-editor/plugins/peak-media-embed-plugin/constants";

export interface PeakEditorControl {
    controlType: "mark" | "block" | "list" | "img" | "code_block" | undefined
    markup?: string[]
    trigger?: string[]
    markupLabel?: string[]
    elementType: string
    label: string
    customFormat?: (editor: SPEditor) => void
}

export interface PeakEditorControlDisplay extends PeakEditorControl {
    hotkeyInstructionArray?: string[]
    description?: string
    icon?: ReactNode,
    className?: string
}

const BOLD_MARK: PeakEditorControlDisplay = {
    controlType: "mark",
    icon: <BoldOutlined className={"peak-editor-control-icon"}/>,
    label: "Bold",
    elementType: MARK_BOLD,
    markupLabel: ["**Bold**"],
    hotkeyInstructionArray: ['⌘', 'B'],
};
const ITALIC_MARK: PeakEditorControlDisplay = {
    controlType: "mark",
    icon: <ItalicOutlined className={"peak-editor-control-icon"}/>,
    label: "Italic",
    elementType: MARK_ITALIC,
    markupLabel: ["*Italic*"],
    hotkeyInstructionArray: ['⌘', 'I'],
};
const PEAK_CODE_MARK: PeakEditorControlDisplay = {
    controlType: "mark",
    icon: <HighlightOutlined className={"peak-editor-control-icon"}/>,
    label: "Code",
    elementType: MARK_CODE,
    markupLabel: ["`Code`"],
    markup: ['`Code`']
};
const UNDERLINE_MARK: PeakEditorControlDisplay = {
    controlType: "mark",
    icon: <UnderlineOutlined className={"peak-editor-control-icon"}/>,
    label: "Underline",
    elementType: MARK_UNDERLINE,
    hotkeyInstructionArray: ['⌘', 'U'],
};
const STRIKETHROUGH_MARK: PeakEditorControlDisplay = {
    controlType: "mark",
    icon: <StrikethroughOutlined className={"peak-editor-control-icon"}/>,
    label: "Strikethrough",
    elementType: MARK_STRIKETHROUGH,
    markupLabel: ["~~Strikethrough~~"],
    hotkeyInstructionArray: ['⌘', 'X'],
};
const ORDERED_LIST: PeakEditorControlDisplay = {
    controlType: "list",
    icon: <OrderedListOutlined className={"peak-editor-control-icon"}/>,
    label: "Numbered List",
    description: "Create an ordered List",
    markup: ['1.', '1)'],
    markupLabel: ["1.", "Space"],
    hotkeyInstructionArray: ['⌘', '⇧', '9'],
    elementType: defaultOptions[ELEMENT_LI].type,
    customFormat: (editor) => {
        toggleList(editor as SPEditor, { type: defaultOptions[ELEMENT_OL].type })
    },

};
const UNORDERED_LIST: PeakEditorControlDisplay = {
    controlType: "list",
    icon: <UnorderedListOutlined className={"peak-editor-control-icon"}/>,
    label: "Bulleted List",
    description: "Create an unordered List",
    markup: ['*', '-', '+'],
    markupLabel: ["*", "Space"],
    hotkeyInstructionArray: ['⌘', '⇧', '8'],

    // Pulled from open-source
    elementType: defaultOptions[ELEMENT_LI].type,
    customFormat: (editor) => {
        toggleList(editor as SPEditor, { type: defaultOptions[ELEMENT_UL].type })
    },
};


const PEAK_LINK: PeakEditorControlDisplay = {
    controlType: undefined,
    icon: <LinkOutlined className={"peak-editor-control-icon"}/>,
    label: "Link",
    elementType: ELEMENT_LINK,
    hotkeyInstructionArray: ['⌘', 'K'],
    customFormat: (editor => toggleMark(editor, ELEMENT_LINK)),
};
// const PEAK_CODE_BLOCK: PeakEditorControlDisplay = {
//     controlType: ELEMENT_CODE_BLOCK,
//     icon: <CodeOutlined className={"peak-editor-control-icon"}/>,
//     label: "Code Block",
//     description: "Display code with syntax highlighting",
//     elementType: ELEMENT_CODE_BLOCK,
//     markup: ['``'],
//     trigger: ['`'],
//     markupLabel: ["```", "Space"],
//     customFormat: (editor => createAndFocusCodeBlock(editor)),
// };
const BASIC_CODE_BLOCK: PeakEditorControlDisplay = {
    controlType: "block",
    icon: <CodeOutlined className={"peak-editor-control-icon"}/>,
    label: "Code Block",
    description: "Display code with syntax highlighting",
    elementType: ELEMENT_CODE_BLOCK,
    markup: ['```'],
    markupLabel: ["```", "Space"],
};
const PEAK_QUOTE: PeakEditorControlDisplay = {
    controlType: "block",
    icon: <RightOutlined className={"peak-editor-control-icon"}/>,
    label: "Quote",
    description: "Insert a quote or citation",
    elementType: ELEMENT_BLOCKQUOTE,
    markup: ['>'],
    markupLabel: [">", "Space"],
};
const TABLE_MARK: PeakEditorControlDisplay = {
    controlType: undefined,
    icon: <TableOutlined className={"peak-editor-control-icon"}/>,
    description: "Insert a table",
    label: "Table",
    elementType: "table",
    customFormat: (editor => message.info("Not implemented yet!")),
};
const PEAK_CALLOUT_BLOCK: PeakEditorControlDisplay = {
    controlType: "block",
    icon: <InfoCircleOutlined className={"peak-editor-control-icon"}/>,
    description: "Callout important information",
    markup: ['<>'],
    label: "Callout",
    markupLabel: ["<>", "Space"],
    elementType: PEAK_CALLOUT,
};
const PEAK_LEARNING_BLOCK: PeakEditorControlDisplay = {
    controlType: "block",
    icon: <BulbOutlined className={"peak-editor-control-icon"}/>,
    description: "Record something you learned!",
    label: "Learning",
    elementType: PEAK_LEARNING,
    customFormat: (editor => insertCustomBlockElement(editor, PEAK_LEARNING))
};
const PEAK_BOOK_NOTE_SELECT_ITEM: PeakEditorControlDisplay = {
    controlType: "block",
    icon: <BookOutlined className={"peak-editor-control-icon"}/>,
    description: "Take down a note from a book you are reading!",
    label: "Book Note",
    elementType: PEAK_BOOK_SELECT_ITEM,
};
// const PEAK_BOOK_NOTE_BLOCK: PeakEditorControlDisplay = {
//     controlType: "block",
//     icon: <ReadOutlined className={"peak-editor-control-icon"}/>,
//     description: "Take down a note from a book you are reading!",
//     label: "Book Note",
//     elementType: ELEMENT_PEAK_BOOK,
//     customFormat: (editor => insertCustomBlockElement(editor, ELEMENT_PEAK_BOOK))
// };
const DIVIDER_MARK: PeakEditorControlDisplay = {
    controlType: undefined,
    description: "Separate content with a horizontal line",
    icon: <MinusOutlined className={"peak-editor-control-icon"}/>,
    label: "Divider",
    elementType: DIVIDER,
};
// const IMAGE_MARK: PeakEditorControlDisplay = {
//     controlType: ELEMENT_IMAGE,
//     description: "Add images to your page",
//     icon: <PictureOutlined className={"peak-editor-control-icon"}/>,
//     label: "Image",
//     customFormat: (editor => message.info("Just copy an image or link and paste into the editor")),
//     elementType: ELEMENT_IMAGE,
// };

const NORMAL_TEXT: PeakEditorControlDisplay = {
    icon: <PictureOutlined className={"peak-editor-control-icon"}/>,
    controlType: "block",
    label: "Normal Text",
    elementType: ELEMENT_PARAGRAPH,
    hotkeyInstructionArray: ['⌘', '⇧', '0'],
};
const HEADER_ONE: PeakEditorControlDisplay = {
    icon: <Icon icon={headingH1} className={"peak-editor-control-icon"}/>,
    controlType: "block",
    label: "Heading 1",
    markup: ['#'],
    elementType: ELEMENT_H1,
    description: "Use this for a top level heading",
    hotkeyInstructionArray: ['⌘', '⇧', '1'],
    markupLabel: ["#", "Space"],
    className: "h1",
};
const HEADER_TWO: PeakEditorControlDisplay = {
    icon: <Icon icon={headingH2} className={"peak-editor-control-icon"}/>,
    description: "Use this for key sections",
    controlType: "block",
    markup: ['##'],
    label: "Heading 2",
    elementType: ELEMENT_H2,
    hotkeyInstructionArray: ['⌘', '⇧', '2'],
    markupLabel: ["##", "Space"],
    className: "h2",
};
const HEADER_THREE: PeakEditorControlDisplay = {
    icon: <Icon icon={headingH3} className={"peak-editor-control-icon"}/>,
    controlType: "block",
    label: "Heading 3",
    elementType: ELEMENT_H3,
    markup: ['###'],
    hotkeyInstructionArray: ['⌘', '⇧', '3'],
    markupLabel: ["###", "Space"],
    description: "Use this for sub sections",
    className: "h3",
};
const HEADER_FOUR: PeakEditorControlDisplay = {
    icon: <Icon icon={headingH4} className={"peak-editor-control-icon"}/>,
    controlType: "block",
    label: "Heading 4",
    markup: ['####'],
    elementType: ELEMENT_H4,
    markupLabel: ["####", "Space"],
    hotkeyInstructionArray: ['⌘', '⇧', '4'],
    description: "Use this for deep headings",
    className: "h4",
};
const HEADER_FIVE: PeakEditorControlDisplay = {
    icon: <Icon icon={headingH5} className={"peak-editor-control-icon"}/>,
    markup: ['#####'],
    controlType: "block",
    description: "Use this fro grouping list items",
    label: "Heading 5",
    elementType: ELEMENT_H5,
    markupLabel: ["#####", "Space"],
    hotkeyInstructionArray: ['⌘', '⇧', '5'],
    className: "h5",
};

export const TEXT_MARKS: PeakEditorControlDisplay[] = [NORMAL_TEXT, HEADER_ONE, HEADER_TWO, HEADER_THREE, HEADER_FOUR, HEADER_FIVE];

// THIS IS THE ONE THAT MATTERS
export const NODE_CONTENT_TYPES: PeakEditorControlDisplay[] = [
    HEADER_ONE,
    HEADER_TWO,
    HEADER_THREE,
    HEADER_FOUR,
    HEADER_FIVE,
    UNORDERED_LIST,
    ORDERED_LIST,
    // PEAK_CODE_BLOCK,
    BASIC_CODE_BLOCK,
    PEAK_QUOTE,
    TABLE_MARK,
    PEAK_CALLOUT_BLOCK,
    DIVIDER_MARK,
    PEAK_LEARNING_BLOCK,
    PEAK_BOOK_NOTE_SELECT_ITEM,
    // IMAGE_MARK
]
export const NODE_CONTENT_LIST_ITEMS: PeakNodeSelectListItem[] = [...NODE_CONTENT_TYPES, ...PEAK_MEDIA_EMBED_CONTROLS].map(convertEditorControlDisplayToNodeSelectListItem)

// These three below are only used for Toolbar and are thus deprecated
export const BASIC_EDITOR_CONTROLS: PeakEditorControl[] = [BOLD_MARK, ITALIC_MARK, UNDERLINE_MARK, STRIKETHROUGH_MARK];
export const LIST_EDITOR_CONTROLS: PeakEditorControl[] = [UNORDERED_LIST, ORDERED_LIST];
export const RICH_EDITOR_CONTROLS: PeakEditorControl[] = [PEAK_QUOTE, TABLE_MARK, PEAK_CALLOUT_BLOCK, DIVIDER_MARK];

// Undo, Clear formatting, Code?, Redo, Emoji, Quick Insert?
export const KEYBOARD_SHORTCUTS: PeakEditorControlDisplay[] = [
    BOLD_MARK,
    ITALIC_MARK,
    UNDERLINE_MARK,
    STRIKETHROUGH_MARK,
    HEADER_ONE,
    HEADER_TWO,
    HEADER_THREE,
    HEADER_FOUR,
    HEADER_FIVE,
    UNORDERED_LIST,
    ORDERED_LIST,
    PEAK_LINK,
]

export const MARKDOWN_SHORTCUTS: PeakEditorControlDisplay[] = [
    BOLD_MARK,
    ITALIC_MARK,
    STRIKETHROUGH_MARK,
    HEADER_ONE,
    HEADER_TWO,
    HEADER_THREE,
    HEADER_FOUR,
    HEADER_FIVE,
    UNORDERED_LIST,
    ORDERED_LIST,
    PEAK_CODE_MARK,
    PEAK_CALLOUT_BLOCK,
    PEAK_QUOTE,
    BASIC_CODE_BLOCK
]