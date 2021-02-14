import React, {useCallback, useEffect, useMemo, useState} from 'react'
import {ReactEditor, Slate} from "slate-react";
import {EditablePlugins, pipe} from "@udecode/slate-plugins";
import {createEditor, Node, Transforms} from "slate";
import MemoizedLinkMenu from "../../../../common/rich-text-editor/plugins/peak-link-plugin/link-menu/LinkMenu";
import {NodeContentSelect} from "../../../../common/rich-text-editor/utils/node-content-select/components/NodeContentSelect";
import {PeakNote, STUB_BOOK_ID} from "../../../../redux/slices/noteSlice";
import {useDebouncePeakNoteSaver, useSpecificNote} from "../../../../client/notes";
import {useActiveEditorState} from "../../../../redux/slices/activeEditor/activeEditorSlice";
import {baseKeyBindingHandler} from "../../../../common/rich-text-editor/utils/keyboard-handler";
import {useNodeContentSelect} from "../../../../common/rich-text-editor/utils/node-content-select/useNodeContentSelect";
import {
    NOTE_NODE_LEVEL,
    noteNormalizers,
    notePlugins
} from "../../../../common/rich-text-editor/editors/note-editor/config";
import "./peak-note-editor.scss"
import {useCurrentUser} from "../../../../utils/hooks";
import {EMPTY_PARAGRAPH_NODE} from "../../../../common/rich-text-editor/editors/constants";
import {sleep} from "../../../../chrome-extension/utils/generalUtil";
import { Editor } from 'slate';
import {ELEMENT_PEAK_BOOK} from "../../../../common/rich-text-editor/plugins/peak-knowledge-plugin/constants";

export const PeakNoteEditor = (props: { note_id: string }) => {
    const { note_id } = props
    const currentNote: PeakNote | undefined = useSpecificNote(note_id)
    const editorState = useActiveEditorState()
    const currentUser = useCurrentUser()
    const noteSaver = useDebouncePeakNoteSaver()
    const bodyContent: Node[] = (currentNote) ? [{ children: currentNote.body }] : [{ children: [EMPTY_PARAGRAPH_NODE()] }]
    const [noteContent, setNoteContent] = useState<Node[]>(bodyContent)

    const currentPageId = `note-${(currentNote) ? currentNote.id : STUB_BOOK_ID}`

    // @ts-ignore
    const editor: ReactEditor = useMemo(() => pipe(createEditor(), ...noteNormalizers), []);

    const updateNoteContent = (newBody: Node[]) => {
        setNoteContent(newBody)

        if (currentNote) {
            noteSaver(currentUser.id, currentNote.id, { body: newBody[0]["children"] as Node[] })

            /**
             *  1. Find today's Journal Entry
             *  2. If a node corresponding to the current Note does NOT exist
             *  3. Append a stub pointing to the current note
             */
        }
        onChangeMention(editor);
        ReactEditor.focus(editor)
    }

    // Why the fuck is this needed
    useEffect(() => {
        sleep(100).then(() => {
            Transforms.select(editor, Editor.end(editor, []));
            ReactEditor.focus(editor)
        })
    }, [])

    // PeakInlineSelect nonsense
    const {
        values,
        onAddNodeContent,
        openLibraryResults,
        onChangeMention,
        onKeyDownSelect,
        search,
        index,
        target,
        nodeContentSelectMode
    } = useNodeContentSelect({
        editorLevel: NOTE_NODE_LEVEL,
        maxSuggestions: 10,
        trigger: '/',
    });

    const defaultKeyBindingHandler = useCallback((event: any) => {
        baseKeyBindingHandler(event, editor)
    }, [])

    return (
        <Slate
            editor={editor}
            value={noteContent}
            onChange={updateNoteContent}>
            <div className="peak-note-editor-container">
                <MemoizedLinkMenu
                    key={`${currentPageId}-LinkMenu`}
                    linkState={editorState.currentLinkState}
                    showLinkMenu={editorState.showLinkMenu}
                    pageId={currentPageId}/>
                <div className={"rich-text-editor-container"}>
                    <EditablePlugins
                        onKeyDown={[defaultKeyBindingHandler, (e) => onKeyDownSelect(e, editor)]}
                        onKeyDownDeps={[index, search, target, openLibraryResults]}
                        key={`${currentPageId}-${editorState.isEditing}`}
                        plugins={notePlugins}
                        placeholder="Drop some knowledge..."
                        spellCheck={true}
                        autoFocus={true}
                        readOnly={!editorState.isEditing}
                        style={{
                            textAlign: "left",
                            flex: "1 1 auto",
                            minHeight: "100%"
                        }}
                    />
                    <NodeContentSelect
                        at={target}
                        openLibraryBooks={openLibraryResults}
                        valueIndex={index}
                        options={values}
                        onClickMention={onAddNodeContent}
                        nodeContentSelectMode={nodeContentSelectMode}
                    />
                </div>
            </div>
        </Slate>
    )
}
