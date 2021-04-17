import "./save-note-editor.scss"
import React from "react";
import {SlatePlugins} from "@udecode/slate-plugins";
import {Node} from "slate";
import {equals} from "ramda";
import {defaultOptions} from "../../../../../../../common/rich-text-editor/options";
import { defaultEditableProps } from "../../../../../../../common/rich-text-editor/editorFactory";
import {useBasicPlugins} from "../../../../../../../common/rich-text-editor/base_plugins";
import {useComponents} from "../../../../../../../common/rich-text-editor/components";

export const SaveNoteEditor = (props: { initialValue: Node[], onChange: (newValue: Node[]) => void }) => {
    const { initialValue, onChange } = props

    const updatePageContent = (newValue: Node[]) => {
        if (!equals(newValue, initialValue)) {
            onChange(newValue)
        }
    }

    return (
        <SlatePlugins
            id={"extensionNoteEditor"}
            plugins={useBasicPlugins()}
            components={useComponents(false, false)}
            onChange={updatePageContent}
            options={defaultOptions}
            editableProps={defaultEditableProps}
            initialValue={initialValue}
        />
    )
}