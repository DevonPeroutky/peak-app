import React, {useCallback, useEffect, useMemo, useState} from 'react'
import {createEditor, Node, Transforms} from "slate";
import {PeakNote, STUB_BOOK_ID} from "../../../../redux/slices/noteSlice";
import {
    useCurrentNote,
    useDebouncePeakNoteSaver,
    useSpecificNote
} from "../../../../client/notes";
import {beginSavingPage, useActiveEditorState} from "../../../../redux/slices/activeEditor/activeEditorSlice";
import {useNodeContentSelect} from "../../../../common/rich-text-editor/utils/node-content-select/useNodeContentSelect";
import "./peak-note-editor.scss"
import {useCurrentUser, useJournal} from "../../../../utils/hooks";
import {EMPTY_PARAGRAPH_NODE} from "../../../../common/rich-text-editor/editors/constants";
import {drop, equals, sort} from "ramda";
import {useDispatch} from "react-redux";
import {PeakEditor} from "../../../../common/rich-text-editor/editorFactory";

export const PeakNoteEditor = (props: { note_id: string }) => {
    const { note_id } = props
    const currentNote: PeakNote | undefined = useSpecificNote(note_id)
    const dispatch = useDispatch()
    const editorState = useActiveEditorState()
    const currentUser = useCurrentUser()
    const noteSaver = useDebouncePeakNoteSaver()
    const noteInRedux = useCurrentNote()
    const bodyContent: Node[] = (currentNote) ? currentNote.body : [EMPTY_PARAGRAPH_NODE()]
    const [noteContent, setNoteContent] = useState<Node[]>(bodyContent)

    const currentPageId = `note-${(currentNote) ? currentNote.id : STUB_BOOK_ID}`

    const updateNoteContent = (newBody: Node[]) => {
        if (!equals(newBody, noteContent)) {
            if (!editorState.isSaving) {
                dispatch(beginSavingPage());
            }
            setNoteContent(newBody)
            noteSaver(currentUser, currentNote.id, { body: newBody as Node[] })
        }
    }

    useEffect(() => {
        const noteBodyInRedux: Node[] = noteInRedux.body

        if (equals(noteBodyInRedux, noteContent)) {
            console.log(`No outside updates were made to Redux`)
        } else {
            setNoteContent(noteBodyInRedux)
        }
    }, [noteInRedux.body])

    const { plugin: nodeSelectPlugin, getNodeContentSelectProps } = useNodeContentSelect({
        maxSuggestions: 10,
        trigger: '/',
    });

    console.log(noteContent)

    return (
        <PeakEditor
            additionalPlugins={[nodeSelectPlugin]}
            onChange={updateNoteContent}
            getNodeContentSelectProps={getNodeContentSelectProps}
            initialValue={noteContent}
            currentPageId={currentPageId}
        />
    )
}
