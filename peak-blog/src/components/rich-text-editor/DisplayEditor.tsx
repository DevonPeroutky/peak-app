import React, {useEffect} from "react";
import { SlatePlugins } from "@udecode/slate-plugins-core";
import { EditableProps } from "slate-react/dist/components/editable";
import { createSlatePluginsOptions } from "@udecode/slate-plugins";
import { pluginsBasic, useReadOnlyComponents } from "component-library/dist";

export const readOnlyProps: EditableProps = {
    // placeholder: 'Enter some rich text…',
    spellCheck: false,
    readOnly: true,
    // style: editorStyle,
};

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
            components={useReadOnlyComponents()}
            editableProps={readOnlyProps}
            initialValue={value}
        />
    )
}
