import React, {useState} from 'react'
import "./scratchpad.scss"
import { useDispatch } from "react-redux";
import {createEditor, Editor, Node, Transforms} from "slate";
import MemoizedLinkMenu from "../../common/rich-text-editor/plugins/peak-link-plugin/link-menu/LinkMenu";
import {useCurrentUser, useScratchpad} from '../../utils/hooks';
import { equals } from "ramda";
import {pipe, SlatePlugin, SlatePlugins, useTSlateStatic} from "@udecode/slate-plugins";
import { useNodeContentSelect } from "../../common/rich-text-editor/utils/node-content-select/useNodeContentSelect";
import { NodeContentSelect } from "../../common/rich-text-editor/utils/node-content-select/components/NodeContentSelect";
import { beginSavingPage, useActiveEditorState } from "../../redux/slices/activeEditor/activeEditorSlice";
import {useDebouncePeakScratchpadSaver} from "../../client/scratchpad";
import {Peaker} from "../../types";
import {sleep} from "../../chrome-extension/utils/generalUtil";
import {SCRATCHPAD_ID} from "../../common/rich-text-editor/editors/scratchpad/constants";
import {defaultComponents} from "../../common/rich-text-editor/components";
import {defaultOptions} from "../../common/rich-text-editor/options";
import {defaultEditableProps, PeakEditor, usePeakPlugins} from "../../common/rich-text-editor/editorFactory";

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

    const { plugin: nodeSelectPlugin, getNodeContentSelectProps } = useNodeContentSelect({
        maxSuggestions: 10,
        trigger: '/',
    });

    const updatePageContent = (newValue: Node[]) => {
        if (!equals(newValue, scratchPadContent)) {
            if (!editorState.isSaving) {
                dispatch(beginSavingPage());
            }
            setScratchpadContent(newValue)

            syncScratchpad(currentUser.id, newValue, reduxScratchpad.id);
        }
    }

    return (
        <div className={"scratchpad-container"}>
            <h1 className={"peak-page-title"}>Scratchpad</h1>
            <PeakEditor
                additionalPlugins={[nodeSelectPlugin]}
                onChange={updatePageContent}
                getNodeContentSelectProps={getNodeContentSelectProps}
                initialValue={scratchPadContent}
                currentPageId={SCRATCHPAD_ID}
            />
        </div>
    )
};
