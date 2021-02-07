import React, {useCallback, useMemo, useState} from 'react'
import {ReactEditor, Slate} from "slate-react";
import {EditablePlugins, pipe} from "@udecode/slate-plugins";
import {createEditor, Node} from "slate";
import MemoizedLinkMenu from "../../../../common/rich-text-editor/plugins/peak-link-plugin/link-menu/LinkMenu";
import PageContextBar from "../../../../common/page-context-bar/PageContextBar";
import {NodeContentSelect} from "../../../../common/rich-text-editor/utils/node-content-select/components/NodeContentSelect";
import {PeakNote} from "../../../../redux/slices/noteSlice";
import {useCurrentNote, useDebouncePeakNoteSaver} from "../../../../client/notes";
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

export const PeakNoteEditor = (props) => {
    const currentNote: PeakNote = useCurrentNote()
    const editorState = useActiveEditorState()
    const currentUser = useCurrentUser()
    const currentPageId = `note-${currentNote.id}`
    const bodyContent: Node[] = [{ children: currentNote.body }]
    const [noteContent, setNoteContent] = useState<Node[]>(bodyContent)
    const noteSaver = useDebouncePeakNoteSaver()

    // @ts-ignore
    const editor: ReactEditor = useMemo(() => pipe(createEditor(), ...noteNormalizers), []);

    const updateNoteContent = (newBody: Node[]) => {
        setNoteContent(newBody)
        noteSaver(currentUser.id, currentNote.id, { body: newBody[0]["children"] as Node[] })
    }
    const defaultKeyBindingHandler = useCallback((event: any) => {
        baseKeyBindingHandler(event, editor)
    }, [])

    // PeakInlineSelect nonsense
    const {
        values,
        onAddNodeContent,
        openLibraryResults,
        onKeyDownMention,
        search,
        index,
        target,
        nodeContentSelectMode
    } = useNodeContentSelect({
        editorLevel: NOTE_NODE_LEVEL,
        maxSuggestions: 10,
        trigger: '/',
    });

    function keyBindingHandler(event): void | false {
        baseKeyBindingHandler(event, editor)
        return onKeyDownMention(event, editor, openLibraryResults)
    }

    console.log("Note Content", noteContent)

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

                    {/*
                    TODO: ADD ABILITY TO DELETE A NOTE
                    <PageContextBar topicId={topic_id}/>
                    */}
                    <EditablePlugins
                        onKeyDown={[defaultKeyBindingHandler, keyBindingHandler]}
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
