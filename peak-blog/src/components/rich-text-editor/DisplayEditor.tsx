import React, {useEffect} from "react";
import { SlatePlugins } from "@udecode/slate-plugins-core";
import {
    pluginOptions,
    readOnlyProps,
    useReadOnlyComponents,
    readOnlyPlugins
} from "component-library/dist";

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
            plugins={readOnlyPlugins}
            options={pluginOptions}
            components={useReadOnlyComponents()}
            editableProps={readOnlyProps}
            initialValue={value}
        />
    )
}
