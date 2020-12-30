import "./save-note-editor.scss"
import React, {useMemo, useState} from "react";
import {Slate, ReactEditor} from "slate-react";
import {EditablePlugins, pipe} from "@udecode/slate-plugins";
import {createEditor, Node} from "slate";
import {equals} from "ramda";
import {baseKeyBindingHandler} from "../../../../common/rich-text-editor/utils/keyboard-handler";
import {INITIAL_PAGE_STATE} from "../../../../redux/slices/wikiPageSlice";
import { chromeExtensionNormalizers, chromeExtensionPlugins } from "../../../../common/rich-text-editor/editors/chrome-extension/config";
import {CHROME_EXTENSION} from "../../../../common/rich-text-editor/editors/chrome-extension/constants";

export const SaveNoteEditor = (props) => {
    const [content, setContent] = useState<Node[]>(INITIAL_PAGE_STATE.body as Node[])

    // @ts-ignore
    const editor: ReactEditor = useMemo(() => pipe(createEditor(), ...chromeExtensionNormalizers), []);

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