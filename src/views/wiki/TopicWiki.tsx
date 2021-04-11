import React, {useCallback, useMemo, useState} from 'react'
import "./topic-wiki.scss"
import {useDispatch} from "react-redux";
import 'antd/dist/antd.css';
import {createEditor, Node} from "slate";
import MemoizedLinkMenu from "../../common/rich-text-editor/plugins/peak-link-plugin/link-menu/LinkMenu";
import PageContextBar from "../../common/page-context-bar/PageContextBar";
import {useHotkeys} from "react-hotkeys-hook";
import { usePagePublisher, useDebounceWikiSaver, useCurrentPage, useDebouncePageTitleUpdater } from '../../utils/hooks';
import { equals } from "ramda";
import {
    SlatePlugins,
    useTSlateStatic
} from "@udecode/slate-plugins";
import {useNodeContentSelect} from "../../common/rich-text-editor/utils/node-content-select/useNodeContentSelect";
import {baseKeyBindingHandler} from "../../common/rich-text-editor/utils/keyboard-handler";
import {NodeContentSelect} from "../../common/rich-text-editor/utils/node-content-select/components/NodeContentSelect";
import {beginSavingPage, setEditing, useActiveEditorState} from "../../redux/slices/activeEditor/activeEditorSlice";
import {defaultComponents} from "../../common/rich-text-editor/components";
import {defaultEditableProps, usePeakPlugins} from "../../common/rich-text-editor/editorFactory";
import {defaultOptions} from "../../common/rich-text-editor/options";
import {UghEditorType} from "../../common/rich-text-editor/types";
import {wikiNormalizers, wikiSpecificPlugins} from "../../common/rich-text-editor/editors/wiki/config";

const TopicWiki = (props: {topic_id: string}) => {
    const { topic_id } = props;
    const dispatch = useDispatch();
    const editorState = useActiveEditorState()
    const publishPage = usePagePublisher();
    const savePageToDB = useDebounceWikiSaver();
    const updatePageEverywhere = useDebouncePageTitleUpdater();
    const currentWikiPage = useCurrentPage();
    const currentPageId: string = currentWikiPage.id;

    const [wikiPageContent, setWikiPageContent] = useState<Node[]>(currentWikiPage.body as Node[])
    const [pageTitle, setPageTitle] = useState(currentWikiPage.title)

    // PeakInlineSelect nonsense
    // const {
    //     values,
    //     openLibraryResults,
    //     onAddNodeContent,
    //     onChangeMention,
    //     onKeyDownSelect,
    //     search,
    //     index,
    //     target,
    //     nodeContentSelectMode
    // } = useNodeContentSelect({
    //     trigger: '/',
    // });

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

    const editor: UghEditorType = useTSlateStatic()

    const updatePageContent = (newValue: Node[]) => {
        if (!equals(newValue, wikiPageContent)) {
            if (!editorState.isSaving) {
                dispatch(beginSavingPage());
            }
            // updateComponentPageContent
            setWikiPageContent(newValue)

            // If PageTitle changed. Update it in Redux immediately due to Sidebar showing the Title's
            const children: Node[] = newValue[0].children as Node[]
            const currentTitle = Node.string(children[0])
            if (currentTitle !== pageTitle) {
                setPageTitle(currentTitle)
                updatePageEverywhere(currentWikiPage.id, currentTitle)
            }

            savePageToDB(newValue, currentTitle, currentWikiPage.id);

            // TODO: ADD THIS BACK IN
            // onChangeMention(editor);
        }
    }

    const wikiPlugins = usePeakPlugins(wikiSpecificPlugins, wikiNormalizers)
    return (
        <SlatePlugins
            id={"topicWiki"}
            plugins={wikiPlugins}
            components={defaultComponents}
            onChange={updatePageContent}
            options={defaultOptions}
            editableProps={defaultEditableProps}
            initialValue={wikiPageContent}
        >
            <div className="peak-topic-wiki-container">
                <MemoizedLinkMenu
                    key={`${currentPageId}-LinkMenu`}
                    linkState={editorState.currentLinkState}
                    showLinkMenu={editorState.showLinkMenu}
                />
                <div className={"rich-text-editor-container"}>
                    <PageContextBar topicId={topic_id}/>
                    {/*<NodeContentSelect*/}
                    {/*    at={target}*/}
                    {/*    openLibraryBooks={openLibraryResults}*/}
                    {/*    valueIndex={index}*/}
                    {/*    options={values}*/}
                    {/*    onAddNodeContent={onAddNodeContent}*/}
                    {/*    nodeContentSelectMode={nodeContentSelectMode}*/}
                    {/*/>*/}
                </div>
            </div>
        </SlatePlugins>
    )
};

export default TopicWiki