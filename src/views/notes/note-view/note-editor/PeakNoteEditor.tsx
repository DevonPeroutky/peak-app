import React, {useMemo, useState} from 'react'
import {ReactEditor, Slate} from "slate-react";
import {EditablePlugins, pipe} from "@udecode/slate-plugins";
import {createEditor, Node} from "slate";
import {wikiNormalizers, wikiPlugins} from "../../../../common/rich-text-editor/editors/wiki/config";
import MemoizedLinkMenu from "../../../../common/rich-text-editor/plugins/peak-link-plugin/link-menu/LinkMenu";
import PageContextBar from "../../../../common/page-context-bar/PageContextBar";
import {NodeContentSelect} from "../../../../common/rich-text-editor/utils/node-content-select/components/NodeContentSelect";
import {PeakNote} from "../../../../redux/slices/noteSlice";
import {useCurrentNote} from "../../../../client/notes";

export const PeakNoteEditor = (props) => {
    const currentNote: PeakNote = useCurrentNote()
    const currentPageId = `note-${currentNote.id}`
    const [noteContent, setWikiPageContent] = useState<Node[]>(currentNote.body)

    // @ts-ignore
    const editor: ReactEditor = useMemo(() => pipe(createEditor(), ...wikiNormalizers), []);


    const updateNoteContent = (newBody: Node[]) => {
        console.log(`Updating note`, newBody)
    }


    return (
        // <Slate
        //     editor={editor}
        //     value={wikiPageContent}
        //     onChange={updateNoteContent}>
        //     <div className="peak-topic-wiki-container">
        //         <MemoizedLinkMenu
        //             key={`${currentPageId}-LinkMenu`}
        //             linkState={currentWikiPage.editorState.currentLinkState}
        //             showLinkMenu={currentWikiPage.editorState.showLinkMenu}
        //             pageId={currentPageId}/>
        //         <div className={"rich-text-editor-container"}>
        //             <PageContextBar topicId={topic_id}/>
        //             <EditablePlugins
        //                 onKeyDown={[defaultKeyBindingHandler, nodeSelectMenuKeyBindingHandler]}
        //                 onKeyDownDeps={[index, search, target]}
        //                 key={`${currentPageId}-${currentWikiPage.editorState.isEditing}`}
        //                 plugins={wikiPlugins}
        //                 placeholder="Drop some knowledge..."
        //                 spellCheck={true}
        //                 autoFocus={true}
        //                 readOnly={!currentWikiPage.editorState.isEditing}
        //                 style={{
        //                     textAlign: "left",
        //                     flex: "1 1 auto",
        //                     minHeight: "100%"
        //                 }}
        //             />
        //             <NodeContentSelect
        //                 at={target}
        //                 valueIndex={index}
        //                 options={values}
        //                 onClickMention={onAddNodeContent}
        //                 nodeContentSelectMode={nodeContentSelectMode}
        //             />
        //         </div>
        //     </div>
        // </Slate>
        <div/>
    )
}
