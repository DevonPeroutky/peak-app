import React, {useEffect, useState} from 'react'
import {useCurrentNote, useDebouncePeakNoteSaver, useSpecificNote} from "../../client/notes";
import {useCurrentUser} from "../../utils/hooks";
import {PeakNote, STUB_BOOK_ID} from "../../redux/slices/noteSlice";
import {PeakTag} from "../../types";
import {useDispatch} from "react-redux";
import {beginSavingPage, useActiveEditorState} from "../../redux/slices/activeEditor/activeEditorSlice";
import {Node} from "slate";
import {EMPTY_PARAGRAPH_NODE} from "../../common/rich-text-editor/editors/constants";
import {equals} from "ramda";
import {useNodeContentSelect} from "../../common/rich-text-editor/utils/node-content-select/useNodeContentSelect";
import {PeakEditor} from "../../common/rich-text-editor/editorFactory";
import {wikiTitleEnforcer} from "../../common/rich-text-editor/editors/wiki/config";
import {createPeakTitlePlugin} from "../../common/rich-text-editor/plugins/peak-title-plugin/PeakTitlePlugin";
import {NoteTagSelect} from "../../common/rich-text-editor/plugins/peak-knowledge-plugin/components/peak-knowledge-node/peak-tag-select/component/NoteTagSelect";
import {TITLE} from "../../common/rich-text-editor/types";
import "./next-gen-note-view.scss"

export const NextGenNoteView = (props: { note: PeakNote, selected_tags: PeakTag[] }) => {
    const { note, selected_tags } = props
    const currentNote: PeakNote | undefined = useSpecificNote(note.id)
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

    return (
        <div className={"peak-note-view-container"}>
            <NoteTagSelect selected_tags={selected_tags} note_id={note.id}/>
            <PeakEditor
                additionalPlugins={[nodeSelectPlugin, wikiTitleEnforcer, createPeakTitlePlugin()]}
                onChange={updateNoteContent}
                getNodeContentSelectProps={getNodeContentSelectProps}
                initialValue={noteContent}
                currentPageId={currentPageId}
                placeholderOverrides={[{
                    key: TITLE,
                    placeholder: 'Give your note a Title',
                    hideOnBlur: false,
                }]}
            />
        </div>
    )
}
