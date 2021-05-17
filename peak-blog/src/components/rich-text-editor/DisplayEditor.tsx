import React, {useEffect} from "react";
import { SlatePlugins } from "@udecode/slate-plugins-core";
import {
    basePlugins,
    pluginOptions,
    readOnlyProps,
    useReadOnlyComponents,
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
            plugins={basePlugins}
            options={pluginOptions}
            components={useReadOnlyComponents()}
            editableProps={readOnlyProps}
            initialValue={value}
        />
    )
}
