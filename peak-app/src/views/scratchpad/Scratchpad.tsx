import React, {useState} from 'react'
import "./scratchpad.scss"
import { useDispatch } from "react-redux";
import {createEditor, Editor, Node, Transforms} from "slate";
import {useCurrentUser, useScratchpad} from '../../utils/hooks';
import { equals } from "ramda";
import { useNodeContentSelect } from "../../common/rich-text-editor/utils/node-content-select/useNodeContentSelect";
import { beginSavingPage, useActiveEditorState } from "../../redux/slices/activeEditor/activeEditorSlice";
import {useDebouncePeakScratchpadSaver} from "../../client/scratchpad";
import {Peaker} from "../../types";
import {SCRATCHPAD_ID} from "../../common/rich-text-editor/editors/scratchpad/constants";
import {PeakEditor} from "../../common/rich-text-editor/editorFactory";
import {ImageUpload} from "../../common/image-upload/ImageUpload";

export const PeakScratchpad = (props: {}) => {
    const dispatch = useDispatch();
    const currentUser: Peaker = useCurrentUser()
    const editorState = useActiveEditorState()
    const syncScratchpad = useDebouncePeakScratchpadSaver();
    const reduxScratchpad = useScratchpad();

    const [scratchPadContent, setScratchpadContent] = useState<Node[]>(reduxScratchpad.body as Node[])

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
            <ImageUpload/>
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
