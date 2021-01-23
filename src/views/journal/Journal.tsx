import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react'
import "./journal.scss"
import {createEditor, Editor, Node, Range} from 'slate';
import {ReactEditor, Slate} from 'slate-react';
import {
    EditablePlugins,
    pipe,
    SlateDocument,
    SlateDocumentFragment,
} from "@udecode/slate-plugins";
import {JOURNAL_ENTRY} from "../../common/rich-text-editor/types";
import {
    useDebounceBulkJournalEntrySaver,
    useCurrentUser,
    useFetchJournal,
    useJournal,
} from "../../utils/hooks";
import {formatDate} from "../../utils/time";
import {useNodeContentSelect} from "../../common/rich-text-editor/utils/node-content-select/useNodeContentSelect";
import {NodeContentSelect} from "../../common/rich-text-editor/utils/node-content-select/components/NodeContentSelect";
import {baseKeyBindingHandler} from "../../common/rich-text-editor/utils/keyboard-handler";
import {
    journalNormalizers,
    journalPlugins
} from "../../common/rich-text-editor/editors/journal/config";
import {
    convertJournalEntryToSlateNodes,
    convertSlateNodeToJournalEntry
} from "../../common/rich-text-editor/editors/journal/utils";
import MemoizedLinkMenu from "../../common/rich-text-editor/plugins/peak-link-plugin/link-menu/LinkMenu";
import {useBottomScrollListener} from "react-bottom-scroll-listener/dist";
import moment from "moment";
import {Empty, message, Skeleton} from "antd";
import { useSelectFirstJournalEntry } from "../../common/rich-text-editor/plugins/journal-entry-plugin/utils";
import  { equals } from "ramda";
import cn from "classnames";
import {PeakNodeSelectListItem} from "../../common/rich-text-editor/utils/node-content-select/types";
import {EMPTY_JOURNAL_STATE} from "../../common/rich-text-editor/editors/journal/constants";
import {PeakWikiPage} from "../../constants/wiki-types";
import {JournalEntry} from "../../common/rich-text-editor/editors/journal/types";

const PeakJournal = (props: { }) => {
    const currentPageId = "journal"

    const currentUser = useCurrentUser()
    const journalFetcher = useFetchJournal()
    const saveBulkJournalEntries = useDebounceBulkJournalEntrySaver()
    const journal: PeakWikiPage = useJournal()
    const setSelection = useSelectFirstJournalEntry()

    // Journal State
    const emptyState: SlateDocument = [
        {
            children: [
                {
                    children: [{text: ''}]
                },
            ]
        }
    ];
    const todayPlaceholder: SlateDocumentFragment = EMPTY_JOURNAL_STATE.flatMap(convertJournalEntryToSlateNodes) as SlateDocumentFragment
    const initialContent2: SlateDocument = [{children: todayPlaceholder }]
    const [journalContent, setJournalContent] = useState<SlateDocument>(initialContent2)

    // Initial Loading
    const [isLoading, setLoading] = useState<boolean>(true)
    useEffect(() => {
        journalFetcher(false).then(async res => {
            setLoading(false)
            const thisIsBad = res as JournalEntry[]
            if (!thisIsBad) {
                return
            }
            const slateJournalNodes = thisIsBad.flatMap(convertJournalEntryToSlateNodes)
            const bodyContent: Node[] = [{ children: slateJournalNodes }]

            const [lastDateLoaded] = thisIsBad.map(je => je.entry_date).slice(-1)
            setLastLoadedDate(lastDateLoaded)

            // @ts-ignore
            setJournalContent(bodyContent)
            setSelection(editor)
        })
    }, [currentUser.id])

    // Infinite Loading State
    const [lastLoadedDate, setLastLoadedDate] = useState<string>()
    const [isLoadingMore, setLoadingMore] = useState<boolean>(false)
    const [atBeginningOfTime, setAtBeginningOfTime] = useState<boolean>(false)
    useBottomScrollListener(async () => {
        if (atBeginningOfTime) {
            return
        }
        await new Promise(r => setTimeout(r, 2000));
        setLoadingMore(true)
        const nextDateToLoadFrom = formatDate(moment(lastLoadedDate).subtract(1, 'days'))
        journalFetcher(true, nextDateToLoadFrom).then(res => {
            const thisIsBad = res as JournalEntry[]
            const newSlateJournalNodes = thisIsBad.flatMap(convertJournalEntryToSlateNodes)

            const [lastDateLoaded] = thisIsBad.map(je => je.entry_date).slice(-1)
            const existingContent = journalContent[0].children
            const newContent = [{ children: [...existingContent, ...newSlateJournalNodes]}]

            // If there actually was more
            if (lastDateLoaded) {
                setLastLoadedDate(lastDateLoaded)
                // @ts-ignore
                setJournalContent(newContent)
            } else {
                setAtBeginningOfTime(true)
                message.info({
                    content: "You have reached the beginning!",
                    key: 1
                })
            }
            setLoadingMore(false)
        })
    });

    // @ts-ignore
    const editor = useMemo<ReactEditor>(() => pipe(createEditor(), ...journalNormalizers),  []);

    // TODO: Refactor these two into a single export for Peak Editors
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
    const keyBindingHandler: (event: any) => false | void = useCallback((event: any) => {
        baseKeyBindingHandler(event, editor)

        return onKeyDownMention(event, editor)
    }, [index, search, target])

    const syncJournalEntries = (newValue: Node[]) => {
        console.log(editor.selection)
        const journalEntries = journal.body as JournalEntry[]
        if (newValue !== journalContent) {
            // Immediately update component state
            // @ts-ignore
            setJournalContent(newValue)

            const rawSlateNodes = newValue[0].children as Node[]
            // Find the modified entries --> Bulk update to DB and sync to redux
            const newEntries: JournalEntry[] = rawSlateNodes.filter(n => n.type === JOURNAL_ENTRY).map(slateNode => convertSlateNodeToJournalEntry(slateNode, currentUser.id))

            const modifiedEntries = newEntries.filter((je, index) => JSON.stringify(je.body) !== JSON.stringify(journalEntries[index].body))
            saveBulkJournalEntries(modifiedEntries, currentUser)
            onChangeMention(editor);
        }
    }

    const isEmpty =  equals(journalContent, emptyState)

    const daComponent = () => {
        if (isEmpty) {
            return <EmptyJournal/>
        } else {
            return <Journal
                editor={editor}
                journalPageState={journal}
                journalContent={journalContent}
                syncJournalEntries={syncJournalEntries}
                currentPageId={currentPageId}
                keyBindingHandler={keyBindingHandler}
                isLoadingMore={isLoadingMore}
                index={index}
                target={target}
                search={search}
                values={values}
                nodeContentSelectMode={nodeContentSelectMode}
                onAddNodeContent={onAddNodeContent}/>

        }
    }

    return (
        <div className={cn("peak-user-home", (isEmpty && !isLoading) ? "empty" : "")}>
            { daComponent() }
        </div>
    )
};

const EmptyJournal = (props: {}) => (
    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={
        "Failed to load your Journal. Try refreshing."
    }/>
)

interface InternalJournalProps {
    // The slate body and handlers
    editor: ReactEditor
    journalPageState: PeakWikiPage
    journalContent: SlateDocument
    syncJournalEntries: (value: Node[]) => void

    // Is Journal Loading more
    isLoadingMore: boolean,

    // Random
    // TODO: This doesn't feel like something we should have to pass
    currentPageId: string,
    keyBindingHandler: (event: any) => false | void,

    // Node Content Select Props
    // TODO: This doesn't feel like something we should have to pass
    index: number,
    target: Range,
    search: string,
    values: PeakNodeSelectListItem[]
    onAddNodeContent: (editor: Editor, data: PeakNodeSelectListItem) => void
    nodeContentSelectMode: boolean
}
const Journal = (props: InternalJournalProps) => {
    const {
        editor,
        journalContent,
        syncJournalEntries,
        currentPageId,
        keyBindingHandler,
        journalPageState,
        isLoadingMore,
        index,
        target,
        values,
        nodeContentSelectMode,
        search,
        onAddNodeContent
    } = props

    return (
        <Slate
            editor={editor}
            value={journalContent}
            onChange={syncJournalEntries}>
            <MemoizedLinkMenu
                key={`${currentPageId}-LinkMenu`}
                linkState={journalPageState.editorState.currentLinkState}
                showLinkMenu={journalPageState.editorState.showLinkMenu}
                pageId={currentPageId}/>
            <EditablePlugins
                onKeyDown={[keyBindingHandler]}
                onKeyDownDeps={[index, search, target]}
                style={{
                    textAlign: "left",
                    flex: "1 1 auto",
                    minWidth: "100%",
                    width: "100%"
                }}
                plugins={journalPlugins}
                autoFocus={true}
            />
            {(isLoadingMore) ? <Skeleton active paragraph title/> : null}
            <NodeContentSelect
                at={target}
                valueIndex={index}
                options={values}
                onClickMention={onAddNodeContent}
                nodeContentSelectMode={nodeContentSelectMode}
            />
        </Slate>
    )
}

export default PeakJournal
