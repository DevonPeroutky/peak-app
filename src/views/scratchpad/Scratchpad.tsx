import React, {useCallback, useEffect, useMemo, useState} from 'react'
import "./scratchpad.scss"
import { useDispatch } from "react-redux";
import { Slate, ReactEditor } from "slate-react";
import {createEditor, Editor, Node, Transforms} from "slate";
import MemoizedLinkMenu from "../../common/rich-text-editor/plugins/peak-link-plugin/link-menu/LinkMenu";
import {useCurrentUser, useScratchpad} from '../../utils/hooks';
import { equals } from "ramda";
import { EditablePlugins, pipe } from "@udecode/slate-plugins";
import { useNodeContentSelect } from "../../common/rich-text-editor/utils/node-content-select/useNodeContentSelect";
import { baseKeyBindingHandler } from "../../common/rich-text-editor/utils/keyboard-handler";
import { NodeContentSelect } from "../../common/rich-text-editor/utils/node-content-select/components/NodeContentSelect";
import { beginSavingPage, useActiveEditorState } from "../../redux/slices/activeEditor/activeEditorSlice";
import { scratchpadNormalizers, scratchpadPlugins } from "../../common/rich-text-editor/editors/scratchpad/config";
import {useDebouncePeakScratchpadSaver} from "../../client/scratchpad";
import {Peaker} from "../../types";
import {sleep} from "../../chrome-extension/utils/generalUtil";

export const PeakScratchpad = (props: {}) => {
    const dispatch = useDispatch();
    const currentUser: Peaker = useCurrentUser()
    const editorState = useActiveEditorState()
    const syncScratchpad = useDebouncePeakScratchpadSaver();
    const reduxScratchpad = useScratchpad();

    const [scratchPadContent, setScratchpadContent] = useState<Node[]>(reduxScratchpad.body as Node[])

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
        openLibraryResults,
        onAddNodeContent,
        onChangeMention,
        onKeyDownSelect,
        search,
        index,
        target,
        nodeContentSelectMode
    } = useNodeContentSelect({
        trigger: '/',
    });

    const defaultKeyBindingHandler = useCallback((event: any) => {
        baseKeyBindingHandler(event, editor)
    }, [])

    // @ts-ignore
    const editor: ReactEditor = useMemo(() => pipe(createEditor(), ...scratchpadNormalizers), []);

    const updatePageContent = (newValue: Node[]) => {
        if (!equals(newValue, scratchPadContent)) {
            if (!editorState.isSaving) {
                dispatch(beginSavingPage());
            }
            // updateComponentPageContent
            setScratchpadContent(newValue)

            syncScratchpad(currentUser.id, newValue, reduxScratchpad.id);
            onChangeMention(editor);
        }
    }

    return (
        <div className={"scratchpad-container"}>
            <h1 className={"peak-page-title"}>Scratchpad</h1>
            <Slate
                editor={editor}
                value={scratchPadContent}
                onChange={updatePageContent}>
                <div className="peak-scratchpad-container">
                    <MemoizedLinkMenu
                        key={`${reduxScratchpad.id}-LinkMenu`}
                        linkState={editorState.currentLinkState}
                        showLinkMenu={editorState.showLinkMenu}
                        />
                    <div className={"rich-text-editor-container"}>
                         <EditablePlugins
                             onKeyDown={[defaultKeyBindingHandler, (e) => onKeyDownSelect(e, editor)]}
                             onKeyDownDeps={[index, search, target, openLibraryResults]}
                             key={`${reduxScratchpad.id}-${editorState.isEditing}`}
                             plugins={scratchpadPlugins}
                             placeholder="What's on your mind..."
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
        </div>
    )
};
