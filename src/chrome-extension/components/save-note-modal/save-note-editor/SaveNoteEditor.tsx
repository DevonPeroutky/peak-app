import "./save-note-editor.scss"
import React from "react";
import {Slate, ReactEditor} from "slate-react";
import {EditablePlugins, pipe} from "@udecode/slate-plugins";
import {createEditor, Node} from "slate";
import {equals} from "ramda";
import {baseKeyBindingHandler} from "../../../../common/rich-text-editor/utils/keyboard-handler";
import { chromeExtensionPlugins } from "../../../../common/rich-text-editor/editors/chrome-extension/config";
import {CHROME_EXTENSION} from "../../../../common/rich-text-editor/editors/chrome-extension/constants";

export const SaveNoteEditor = (props: { content: Node[], setContent: (newValue: Node[]) => void, editor: ReactEditor }) => {
    const { content, setContent, editor } = props

    const updatePageContent = (newValue: Node[]) => {
        if (!equals(newValue, content)) {
            setContent(newValue)
        }
    }

    return (
        <Slate
            editor={editor}
            value={content}
            onChange={updatePageContent}>
            <div className="peak-note-editor-container">
                <EditablePlugins
                    autoFocus
                    className={"peak-note-editor"}
                    onKeyDown={[baseKeyBindingHandler]}
                    key={CHROME_EXTENSION}
                    plugins={chromeExtensionPlugins}
                    placeholder="Drop some knowledge..."
                    spellCheck={true}
                    style={{
                        textAlign: "left",
                        flex: "1 1 auto",
                    }}
                />
            </div>
        </Slate>
    )
}