import React from "react";
import {createHistoryPlugin, createReactPlugin, SlatePlugins} from "@udecode/slate-plugins-core";
import {EditableProps} from "slate-react/dist/components/editable";
import {
    createBlockquotePlugin, createBoldPlugin,
    createCodeBlockPlugin, createCodePlugin, createHeadingPlugin, createItalicPlugin,
    createParagraphPlugin,
    createSlatePluginsComponents,
    createSlatePluginsOptions, createStrikethroughPlugin, createUnderlinePlugin
} from "@udecode/slate-plugins";

// TODO: THIS!
import {usePeakPlugins} from "../../../../peak-app/src/common/rich-text-editor/plugins";
import {useReadOnlyComponents} from "../../../../peak-app/src/common/rich-text-editor/components";

export const readOnlyProps: EditableProps = {
    // placeholder: 'Enter some rich text…',
    spellCheck: false,
    readOnly: true,
    // style: editorStyle,
};

const pluginsBasic = [
    // editor
    createReactPlugin(),          // withReact
    createHistoryPlugin(),        // withHistory

    // elements
    createParagraphPlugin(),      // paragraph element
    createBlockquotePlugin(),     // blockquote element
    createCodeBlockPlugin(),      // code block element
    createHeadingPlugin(),        // heading elements

    // marks
    createBoldPlugin(),           // bold mark
    createItalicPlugin(),         // italic mark
    createUnderlinePlugin(),      // underline mark
    createStrikethroughPlugin(),  // strikethrough mark
    createCodePlugin(),           // code mark
];


export interface DisplayEditorProps {
    value: any
    postId: string
}
export const DisplayEditor = ({
                                  postId,
                                  value
                              }: DisplayEditorProps) => {
    return (
        <SlatePlugins
            id={postId}
            plugins={pluginsBasic}
            options={createSlatePluginsOptions()}
            components={createSlatePluginsComponents()}
            editableProps={readOnlyProps}
            initialValue={value}
        />
    )
}
