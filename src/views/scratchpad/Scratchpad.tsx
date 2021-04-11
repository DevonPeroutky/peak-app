import React, {useCallback, useEffect, useMemo, useState} from 'react'
import "./scratchpad.scss"
import { useDispatch } from "react-redux";
import { Slate, ReactEditor } from "slate-react";
import {createEditor, Editor, Node, Transforms} from "slate";
import MemoizedLinkMenu from "../../common/rich-text-editor/plugins/peak-link-plugin/link-menu/LinkMenu";
import {useCurrentUser, useScratchpad} from '../../utils/hooks';
import { equals } from "ramda";
import {pipe, SlatePlugin, SlatePlugins, useTSlateStatic} from "@udecode/slate-plugins";
import { useNodeContentSelect } from "../../common/rich-text-editor/utils/node-content-select/useNodeContentSelect";
import { baseKeyBindingHandler } from "../../common/rich-text-editor/utils/keyboard-handler";
import { NodeContentSelect } from "../../common/rich-text-editor/utils/node-content-select/components/NodeContentSelect";
import { beginSavingPage, useActiveEditorState } from "../../redux/slices/activeEditor/activeEditorSlice";
import {useDebouncePeakScratchpadSaver} from "../../client/scratchpad";
import {Peaker} from "../../types";
import {sleep} from "../../chrome-extension/utils/generalUtil";
import {SCRATCHPAD_ID} from "../../common/rich-text-editor/editors/scratchpad/constants";
import {defaultComponents} from "../../common/rich-text-editor/utils/components";
import {defaultOptions} from "../../common/rich-text-editor/options";
import {defaultEditableProps, usePeakPlugins} from "../../common/rich-text-editor/editorFactory";
import {Plugins} from "./playground/Playground";

export const PeakScratchpad = (props: {}) => {
    const dispatch = useDispatch();
    const currentUser: Peaker = useCurrentUser()
    const editorState = useActiveEditorState()
    const syncScratchpad = useDebouncePeakScratchpadSaver();
    const reduxScratchpad = useScratchpad();

    const [scratchPadContent, setScratchpadContent] = useState<Node[]>(reduxScratchpad.body as Node[])

    // TODO
    // Why the fuck is this needed
    // useEffect(() => {
    //     sleep(100).then(() => {
    //         Transforms.select(editor, Editor.end(editor, []));
    //         ReactEditor.focus(editor)
    //     })
    // }, [])

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
        maxSuggestions: 10,
        trigger: '/',
    });

    // TODO
    // const defaultKeyBindingHandler = useCallback((event: any) => {
    //     baseKeyBindingHandler(event, editor)
    // }, [])

    const scratchPadSpecificPlugins: SlatePlugin[] = [
        { onChange: onChangeMention }
    ]

    const updatePageContent = (newValue: Node[]) => {
        if (!equals(newValue, scratchPadContent)) {
            if (!editorState.isSaving) {
                dispatch(beginSavingPage());
            }
            setScratchpadContent(newValue)

            syncScratchpad(currentUser.id, newValue, reduxScratchpad.id);
        }
    }

    return <Plugins/>
    // return (
    //     <div className={"scratchpad-container"}>
    //         <h1 className={"peak-page-title"}>Scratchpad</h1>
    //         <SlatePlugins
    //             id={"scratchpad"}
    //             plugins={usePeakPlugins(scratchPadSpecificPlugins)}
    //             components={defaultComponents}
    //             options={defaultOptions}
    //             editableProps={defaultEditableProps}
    //             onChange={updatePageContent}
    //             initialValue={scratchPadContent}
    //         >
    //             <div className="peak-scratchpad-container">
    //                 <MemoizedLinkMenu
    //                     key={`${SCRATCHPAD_ID}-LinkMenu`}
    //                     linkState={editorState.currentLinkState}
    //                     showLinkMenu={editorState.showLinkMenu}
    //                 />
    //                 <div className={"rich-text-editor-container"}>
    //                     <NodeContentSelect
    //                         at={target}
    //                         openLibraryBooks={openLibraryResults}
    //                         valueIndex={index}
    //                         options={values}
    //                         onClickMention={onAddNodeContent}
    //                         nodeContentSelectMode={nodeContentSelectMode}
    //                     />
    //                 </div>
    //             </div>
    //         </SlatePlugins>
    //     </div>
    // )
};
