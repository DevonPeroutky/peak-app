import "./save-note-editor.scss"
import React, {useCallback, useMemo, useState} from "react";
import {Slate, ReactEditor} from "slate-react";
import MemoizedLinkMenu from "../../../../common/rich-text-editor/plugins/peak-link-plugin/link-menu/LinkMenu";
import {EditablePlugins, pipe} from "@udecode/slate-plugins";
import {wikiNormalizers, wikiPlugins} from "../../../../common/rich-text-editor/editors/wiki/constants";
import {NodeContentSelect} from "../../../../common/rich-text-editor/utils/node-content-select/components/NodeContentSelect";
import {createEditor, Node} from "slate";
import {equals} from "ramda";
import {useNodeContentSelect} from "../../../../common/rich-text-editor/utils/node-content-select/useNodeContentSelect";
import {baseKeyBindingHandler} from "../../../../common/rich-text-editor/utils/keyboard-handler";
import {INITIAL_LINK_STATE} from "../../../../redux/slices/wikiPageSlice";


export const SaveNoteEditor = (props) => {
    const [content, setContent] = useState<Node[]>([])
    const currentPageId: string = "chrome-extension"

    // @ts-ignore
    const editor: ReactEditor = useMemo(() => pipe(createEditor(), ...wikiNormalizers), []);

    // PeakInlineSelect nonsense
    const {
        values,
        onAddNodeContent,
        onChangeMention,
        onKeyDownMention,
        search,
        index,
        target,
        nodeContentSelectMode
    } = useNodeContentSelect({
        maxSuggestions: 10,
        trigger: '/',
    });
    const nodeSelectMenuKeyBindingHandler = useCallback((event: any) => {
        return onKeyDownMention(event, editor)
    }, [index, search, target])

    const updatePageContent = (newValue: Node[]) => {
        if (!equals(newValue, content)) {
            // updateComponentPageContent
            setContent(newValue)
            onChangeMention(editor);
        }
    }

    return (
        <Slate
            editor={editor}
            value={content}
            onChange={updatePageContent}>
            <div className="peak-note-editor-container">
                <MemoizedLinkMenu
                    key={`${currentPageId}-LinkMenu`}
                    // linkState={currentWikiPage.editorState.currentLinkState}
                    // showLinkMenu={currentWikiPage.editorState.showLinkMenu}
                    linkState={INITIAL_LINK_STATE}
                    showLinkMenu={false}
                    pageId={currentPageId}/>
                <div className={"peak-rich-text-editor-container"}>
                    <EditablePlugins
                        onKeyDown={[baseKeyBindingHandler, nodeSelectMenuKeyBindingHandler]}
                        onKeyDownDeps={[index, search, target]}
                        key={currentPageId}
                        plugins={wikiPlugins}
                        placeholder="Drop some knowledge..."
                        spellCheck={true}
                        autoFocus={true}
                        readOnly={false}
                        style={{
                            textAlign: "left",
                            flex: "1 1 auto",
                            minHeight: "100%"
                        }}
                    />
                    <NodeContentSelect
                        at={target}
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