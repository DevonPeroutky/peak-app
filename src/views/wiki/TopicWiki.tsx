import React, {useCallback, useMemo, useState} from 'react'
import "./topic-wiki.scss"
import {useDispatch} from "react-redux";
import 'antd/dist/antd.css';
import {Node} from "slate";
import { usePagePublisher, useDebounceWikiSaver, useCurrentPage, useDebouncePageTitleUpdater } from '../../utils/hooks';
import { equals } from "ramda";
import {useNodeContentSelect} from "../../common/rich-text-editor/utils/node-content-select/useNodeContentSelect";
import {beginSavingPage, setEditing, useActiveEditorState} from "../../redux/slices/activeEditor/activeEditorSlice";
import {defaultEditableProps, PeakEditor, usePeakPlugins} from "../../common/rich-text-editor/editorFactory";
import {wikiTitleEnforcer} from "../../common/rich-text-editor/editors/wiki/config";
import { createPeakTitlePlugin } from "../../common/rich-text-editor/plugins/peak-title-plugin/PeakTitlePlugin";

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

    const { plugin: nodeSelectPlugin, getNodeContentSelectProps } = useNodeContentSelect({
        maxSuggestions: 10,
        trigger: '/',
    });

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
        }
    }

    return (
        <div className={"wiki-container"}>
            {/*<PageContextBar topicId={topic_id}/>*/}
            <PeakEditor
                additionalPlugins={[nodeSelectPlugin, wikiTitleEnforcer, createPeakTitlePlugin()]}
                onChange={updatePageContent}
                getNodeContentSelectProps={getNodeContentSelectProps}
                initialValue={wikiPageContent}
                currentPageId={currentPageId}
            />
        </div>
    )
};

export default TopicWiki