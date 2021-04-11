import React, {useCallback, useEffect, useMemo, useState} from 'react'
import {ReactEditor, Slate} from "slate-react";
import {EditablePlugins, pipe, SlatePlugins, useTSlateStatic} from "@udecode/slate-plugins";
import {createEditor, Node, Transforms} from "slate";
import MemoizedLinkMenu from "../../../../common/rich-text-editor/plugins/peak-link-plugin/link-menu/LinkMenu";
import {NodeContentSelect} from "../../../../common/rich-text-editor/utils/node-content-select/components/NodeContentSelect";
import {PeakNote, STUB_BOOK_ID} from "../../../../redux/slices/noteSlice";
import {
    useCurrentNote,
    useDebouncePeakNoteSaver,
    useSpecificNote
} from "../../../../client/notes";
import {beginSavingPage, useActiveEditorState} from "../../../../redux/slices/activeEditor/activeEditorSlice";
import {baseKeyBindingHandler} from "../../../../common/rich-text-editor/utils/keyboard-handler";
import {useNodeContentSelect} from "../../../../common/rich-text-editor/utils/node-content-select/useNodeContentSelect";
import "./peak-note-editor.scss"
import {useCurrentUser, useJournal} from "../../../../utils/hooks";
import {EMPTY_PARAGRAPH_NODE} from "../../../../common/rich-text-editor/editors/constants";
import {sleep} from "../../../../chrome-extension/utils/generalUtil";
import { Editor } from 'slate';
import {drop, equals, sort} from "ramda";
import {useDispatch} from "react-redux";
import {defaultComponents} from "../../../../common/rich-text-editor/components";
import {defaultOptions} from "../../../../common/rich-text-editor/options";
import {defaultEditableProps, usePeakPlugins} from "../../../../common/rich-text-editor/editorFactory";
import {UghEditorType} from "../../../../common/rich-text-editor/types";

export const PeakNoteEditor = (props: { note_id: string }) => {
    const { note_id } = props
    const currentNote: PeakNote | undefined = useSpecificNote(note_id)
    const dispatch = useDispatch()
    const editorState = useActiveEditorState()
    const currentUser = useCurrentUser()
    const noteSaver = useDebouncePeakNoteSaver()
    const noteInRedux = useCurrentNote()
    const bodyContent: Node[] = (currentNote) ? [{ children: currentNote.body }] : [{ children: [EMPTY_PARAGRAPH_NODE()] }]
    const [noteContent, setNoteContent] = useState<Node[]>(bodyContent)

    const currentPageId = `note-${(currentNote) ? currentNote.id : STUB_BOOK_ID}`

    const editor: UghEditorType = useTSlateStatic()

    const updateNoteContent = (newBody: Node[]) => {
        if (!equals(newBody, noteContent)) {
            if (!editorState.isSaving) {
                dispatch(beginSavingPage());
            }
            setNoteContent(newBody)
            noteSaver(currentUser, currentNote.id, { body: newBody[0]["children"] as Node[] })
        }
        // onChangeMention(editor);
    }

    useEffect(() => {
        const noteBodyInRedux: Node[] = [{ children: noteInRedux.body }]

        if (equals(noteBodyInRedux, noteContent)) {
            console.log(`No outside updates were made to Redux`)
        } else {
            setNoteContent(noteBodyInRedux)
        }
    }, [noteInRedux.body])

    // TODO
    // Why the fuck is this needed
    useEffect(() => {
        sleep(100).then(() => {
            Transforms.select(editor, Editor.end(editor, []));
            ReactEditor.focus(editor)
        })
    }, [])

    // PeakInlineSelect nonsense
    // const {
    //     values,
    //     onAddNodeContent,
    //     openLibraryResults,
    //     onChangeMention,
    //     onKeyDownSelect,
    //     search,
    //     index,
    //     target,
    //     nodeContentSelectMode
    // } = useNodeContentSelect({
    //     maxSuggestions: 10,
    //     trigger: '/',
    // });

    const defaultKeyBindingHandler = useCallback((event: any) => {
        baseKeyBindingHandler(event, editor)
    }, [])

    return (
        <SlatePlugins
            id={"noteEditor"}
            plugins={usePeakPlugins()}
            components={defaultComponents}
            options={defaultOptions}
            editableProps={defaultEditableProps}
            onChange={updateNoteContent}
            initialValue={noteContent}
        >
            <div className="peak-note-editor-container">
                <MemoizedLinkMenu
                    key={`${currentPageId}-LinkMenu`}
                    linkState={editorState.currentLinkState}
                    showLinkMenu={editorState.showLinkMenu}
                />
                <div className={"rich-text-editor-container"}>
                    {/*<NodeContentSelect*/}
                    {/*    at={target}*/}
                    {/*    openLibraryBooks={openLibraryResults}*/}
                    {/*    valueIndex={index}*/}
                    {/*    options={values}*/}
                    {/*    onAddNodeContent={onAddNodeContent}*/}
                    {/*    nodeContentSelectMode={nodeContentSelectMode}*/}
                    {/*/>*/}
                </div>
            </div>
        </SlatePlugins>
    )
}
