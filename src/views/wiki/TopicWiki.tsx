import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react'
import "./topic-wiki.scss"
import {useDispatch} from "react-redux";
import {
    setEditing,
    beginSavingPage,
    updatePageTitle,
} from "../../redux/wikiPageSlice";
import {updatePageTitleInSidebar} from "../../redux/topicSlice"
import 'antd/dist/antd.css';
import {Slate, ReactEditor} from "slate-react";
import {createEditor, Node} from "slate";
import MemoizedLinkMenu from "../../common/rich-text-editor/plugins/peak-link-plugin/link-menu/LinkMenu";
import PageContextBar from "../../common/page-context-bar/PageContextBar";
import {useHotkeys} from "react-hotkeys-hook";
import {
    usePagePublisher,
    useDebounceWikiSaver,
    useCurrentWikiPage,
} from '../../utils/hooks';
import { equals } from "ramda";
import {
    EditablePlugins,
    pipe,
} from "@udecode/slate-plugins";
import {NODE_CONTENT_TYPES, PeakEditorControl} from "../../common/peak-toolbar/toolbar-controls";
import {NodeContentSelect} from "../../common/rich-text-editor/utils/node-content-select/NodeContentSelect";
import {useNodeContentSelect} from "../../common/rich-text-editor/utils/node-content-select/useNodeContentSelect";
import {baseKeyBindingHandler} from "../../common/rich-text-editor/utils/keyboard-handler";
import {wikiNormalizers, wikiPlugins} from "../../common/rich-text-editor/editors/wiki/constants";

const TopicWiki = (props: {topic_id: string}) => {
    const { topic_id } = props;
    const dispatch = useDispatch();
    const publishPage = usePagePublisher();
    const savePageToDB = useDebounceWikiSaver();
    const currentWikiPage = useCurrentWikiPage();
    const currentPageId: string = currentWikiPage.id;

    const [wikiPageContent, setWikiPageContent] = useState<Node[]>(currentWikiPage.body as Node[])
    const [pageTitle, setPageTitle] = useState(currentWikiPage.title)

    const {
        onChangeMention,
        onKeyDownMention,
        onAddNodeContent,
        search,
        values,
        index,
        target,
    } = useNodeContentSelect(NODE_CONTENT_TYPES, {
        maxSuggestions: 10,
        trigger: '/',
    });

    useHotkeys('e, command+s', (event, handler) => {
        switch (handler.key) {
            case 'command+s':
                event.preventDefault();
                dispatch(setEditing({ pageId: currentPageId, isEditing: false }));
                break;
            case 'e':
                event.preventDefault();
                dispatch(setEditing({ pageId: currentPageId, isEditing: true }));
                break;
        }
    }, {}, [currentPageId]);

    const keyBindingHandler = useCallback((event: any) => {
        baseKeyBindingHandler(event, editor)

        if (event.metaKey && event.key == 's') {
            event.preventDefault();
            publishPage()
        }
        return onKeyDownMention(event, editor)
    }, [index, search, target])

    // @ts-ignore
    const editor: ReactEditor = useMemo(() => pipe(createEditor(), ...wikiNormalizers), []);

    const updatePageContent = (newValue: Node[]) => {
        console.log(editor.selection)
        if (!equals(newValue, currentWikiPage.body)) {
            if (!currentWikiPage.isSaving) {
                dispatch(beginSavingPage({pageId: currentPageId}));
            }
            // updateComponentPageContent
            setWikiPageContent(newValue)

            // If PageTitle changed. Update it in Redux immediately due to Sidebar showing the Title's
            const children: Node[] = newValue[0].children as Node[]
            const titleNode = Node.string(children[0])
            if (titleNode !== pageTitle) {
                setPageTitle(titleNode)
                updatePageTitleEverywhere(titleNode)
            }

            savePageToDB(newValue, titleNode, currentWikiPage.id);
            onChangeMention(editor);
        }
    }

    const updatePageTitleEverywhere = (newTitle: string) => {
        dispatch(updatePageTitle({ pageId: currentWikiPage.id, title: newTitle }));
        dispatch(updatePageTitleInSidebar({ pageId: currentWikiPage.id, newTitle: newTitle }));
    };

    return (
        <Slate
            editor={editor}
            value={wikiPageContent}
            onChange={updatePageContent}>
            <div className="peak-topic-wiki-container">
                <MemoizedLinkMenu
                    key={`${currentPageId}-LinkMenu`}
                    linkState={currentWikiPage.editorState.currentLinkState}
                    showLinkMenu={currentWikiPage.editorState.showLinkMenu}
                    pageId={currentPageId}/>
                <div className={"rich-text-editor-container"}>
                    <PageContextBar topicId={topic_id}/>
                    <EditablePlugins
                        onKeyDown={[keyBindingHandler]}
                        onKeyDownDeps={[index, search, target]}
                        key={`${currentPageId}-${currentWikiPage.editorState.isEditing}`}
                        plugins={wikiPlugins}
                        placeholder="Drop some knowledge..."
                        spellCheck={true}
                        autoFocus={true}
                        readOnly={!currentWikiPage.editorState.isEditing}
                        style={{
                            textAlign: "left",
                            flex: "1 1 auto",
                            minHeight: "100%"
                        }}
                    />
                    <NodeContentSelect
                        at={target}
                        valueIndex={index}
                        options={values as PeakEditorControl[]}
                        onClickMention={onAddNodeContent}
                    />
                </div>
            </div>
        </Slate>
    )
};

export default TopicWiki