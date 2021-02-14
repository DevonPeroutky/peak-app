import React, {useCallback, useMemo, useState} from 'react'
import "./topic-wiki.scss"
import {useDispatch} from "react-redux";
import 'antd/dist/antd.css';
import {Slate, ReactEditor} from "slate-react";
import {createEditor, Node} from "slate";
import MemoizedLinkMenu from "../../common/rich-text-editor/plugins/peak-link-plugin/link-menu/LinkMenu";
import PageContextBar from "../../common/page-context-bar/PageContextBar";
import {useHotkeys} from "react-hotkeys-hook";
import { usePagePublisher, useDebounceWikiSaver, useCurrentWikiPage, useDebouncePageTitleUpdater } from '../../utils/hooks';
import { equals } from "ramda";
import { EditablePlugins, pipe } from "@udecode/slate-plugins";
import {useNodeContentSelect} from "../../common/rich-text-editor/utils/node-content-select/useNodeContentSelect";
import {baseKeyBindingHandler} from "../../common/rich-text-editor/utils/keyboard-handler";
import {WIKI_NODE_LEVEL, wikiNormalizers, wikiPlugins} from "../../common/rich-text-editor/editors/wiki/config";
import {NodeContentSelect} from "../../common/rich-text-editor/utils/node-content-select/components/NodeContentSelect";
import {beginSavingPage, setEditing, useActiveEditorState} from "../../redux/slices/activeEditor/activeEditorSlice";

const TopicWiki = (props: {topic_id: string}) => {
    const { topic_id } = props;
    const dispatch = useDispatch();
    const editorState = useActiveEditorState()
    const publishPage = usePagePublisher();
    const savePageToDB = useDebounceWikiSaver();
    const updatePageEverywhere = useDebouncePageTitleUpdater();
    const currentWikiPage = useCurrentWikiPage();
    const currentPageId: string = currentWikiPage.id;

    const [wikiPageContent, setWikiPageContent] = useState<Node[]>(currentWikiPage.body as Node[])
    const [pageTitle, setPageTitle] = useState(currentWikiPage.title)

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
        editorLevel: WIKI_NODE_LEVEL,
        maxSuggestions: 10,
        trigger: '/',
    });

    useHotkeys('e, command+s', (event, handler) => {
        switch (handler.key) {
            case 'command+s':
                event.preventDefault();
                dispatch(setEditing({ isEditing: false }));
                break;
            case 'e':
                event.preventDefault();
                dispatch(setEditing({ isEditing: true }));
                break;
        }
    }, {}, [currentPageId]);

    const defaultKeyBindingHandler = useCallback((event: any) => {
        baseKeyBindingHandler(event, editor)

        if (event.metaKey && event.key == 's') {
            event.preventDefault();
            publishPage()
        }
    }, [])

    // @ts-ignore
    const editor: ReactEditor = useMemo(() => pipe(createEditor(), ...wikiNormalizers), []);

    const updatePageContent = (newValue: Node[]) => {
        if (!equals(newValue, wikiPageContent)) {
            if (!editorState.isSaving) {
                dispatch(beginSavingPage());
            }
            // updateComponentPageContent
            setWikiPageContent(newValue)

            // If PageTitle changed. Update it in Redux immediately due to Sidebar showing the Title's
            const children: Node[] = newValue[0].children as Node[]
            const titleNode = Node.string(children[0])
            if (titleNode !== pageTitle) {
                setPageTitle(titleNode)
                updatePageEverywhere(currentWikiPage.id, titleNode)
            }

            savePageToDB(newValue, titleNode, currentWikiPage.id);
            onChangeMention(editor);
        }
    }
    return (
        <Slate
            editor={editor}
            value={wikiPageContent}
            onChange={updatePageContent}>
            <div className="peak-topic-wiki-container">
                <MemoizedLinkMenu
                    key={`${currentPageId}-LinkMenu`}
                    linkState={editorState.currentLinkState}
                    showLinkMenu={editorState.showLinkMenu}
                    pageId={currentPageId}/>
                <div className={"rich-text-editor-container"}>
                    <PageContextBar topicId={topic_id}/>
                    <EditablePlugins
                        onKeyDown={[defaultKeyBindingHandler, (e) => onKeyDownSelect(e, editor)]}
                        onKeyDownDeps={[index, search, target, openLibraryResults]}
                        key={`${currentPageId}-${editorState.isEditing}`}
                        plugins={wikiPlugins}
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
};

export default TopicWiki