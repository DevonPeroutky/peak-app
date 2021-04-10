import "./save-note-editor.scss"
import React from "react";
import {Slate, ReactEditor} from "slate-react";
import {SlatePlugins} from "@udecode/slate-plugins";
import {Node} from "slate";
import {equals} from "ramda";
import {defaultComponents} from "../../../../../../../common/rich-text-editor/utils/components";
import {defaultOptions} from "../../../../../../../common/rich-text-editor/options";
import {defaultEditableProps} from "../../../../../../../common/rich-text-editor/editorFactory";
import {extensionPlugins} from "../../../../../../../common/rich-text-editor/editors/chrome-extension/config";

export const SaveNoteEditor = (props: { content: Node[], setContent: (newValue: Node[]) => void, editor: ReactEditor }) => {
    const { content, setContent, editor } = props

    const updatePageContent = (newValue: Node[]) => {
        if (!equals(newValue, content)) {
            setContent(newValue)
        }
    }

    return (
        <SlatePlugins
            id={"extensionNoteEditor"}
            plugins={extensionPlugins}
            components={defaultComponents}
            onChange={updatePageContent}
            options={defaultOptions}
            editableProps={defaultEditableProps}
            initialValue={content}
        >
            {/*<div className="peak-save-note-editor-container">*/}
            {/*</div>*/}
        </SlatePlugins>
    )
}