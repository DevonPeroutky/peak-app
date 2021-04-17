import "./save-note-editor.scss"
import React from "react";
import {Slate, ReactEditor} from "slate-react";
import {SlatePlugins} from "@udecode/slate-plugins";
import {Node} from "slate";
import {equals} from "ramda";
import {defaultComponents} from "../../../../../../../common/rich-text-editor/components";
import {defaultOptions} from "../../../../../../../common/rich-text-editor/options";
import {
    defaultEditableProps,
    useBasicPlugins,
    usePeakPlugins
} from "../../../../../../../common/rich-text-editor/editorFactory";

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
            components={defaultComponents}
            onChange={updatePageContent}
            options={defaultOptions}
            editableProps={defaultEditableProps}
            initialValue={initialValue}
        />
    )
}