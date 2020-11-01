import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react'
import "./journal.scss"
import {createEditor, Node} from 'slate';
import {Slate, withReact} from 'slate-react';
import {
    EditablePlugins,
    pipe,
    SlateDocument,
} from "@udecode/slate-plugins";
import {JOURNAL_ENTRY} from "../../common/rich-text-editor/constants";
import {
    useDebounceBulkJournalEntrySaver,
    useCurrentUser,
    useFetchJournal,
    useJournal,
} from "../../utils/hooks";
import {formatDate} from "../../utils/time";
import {useNodeContentSelect} from "../../common/rich-text-editor/utils/node-content-select/useNodeContentSelect";
import {NODE_CONTENT_TYPES, PeakEditorControl} from "../../common/peak-toolbar/toolbar-controls";
import {NodeContentSelect} from "../../common/rich-text-editor/utils/node-content-select/NodeContentSelect";
import {baseKeyBindingHandler} from "../../common/rich-text-editor/utils/keyboard-handler";
import {useDispatch} from "react-redux";
import {journalNormalizers, journalPlugins} from "../../common/rich-text-editor/journal/constants";
import {
    convertJournalEntryToSlateNodes,
    convertSlateNodeToJournalEntry
} from "../../common/rich-text-editor/journal/utils";
import {JournalEntry, PeakWikiPage} from "../../redux/wikiPageSlice";
import MemoizedLinkMenu from "../../common/rich-text-editor/plugins/peak-link-plugin/link-menu/LinkMenu";
import {useBottomScrollListener} from "react-bottom-scroll-listener/dist";
import moment from "moment";
import {Empty, message, Skeleton} from "antd";
import { useSelectFirstJournalEntry } from "../../common/rich-text-editor/plugins/journal-entry-plugin/utils";
import  { equals } from "ramda";
import cn from "classnames";

const Journal = (props: { }) => {
    const dispatch = useDispatch()
    const currentUser = useCurrentUser()
    const journalFetcher = useFetchJournal()
    const saveBulkJournalEntries = useDebounceBulkJournalEntrySaver()
    const journal: PeakWikiPage = useJournal()
    const setSelection = useSelectFirstJournalEntry()

    const currentPageId = "journal"
    const [lastLoadedDate, setLastLoadedDate] = useState<string>()
    const [isLoading, setLoading] = useState<boolean>(true)

    // This is the Node[] that is being based into the Editor aka. What the user will see
    const initialContent: SlateDocument = [
        {
            children: [
                {
                    children: [{text: ''}]
                },
            ]
        }
    ];
    const [journalContent, setJournalContent] = useState<SlateDocument>(initialContent)

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

    // @ts-ignore
    const editor = useMemo<ReactEditor>(() => pipe(createEditor(), ...journalNormalizers),  []);

    const keyBindingHandler = useCallback((event: any) => {
        baseKeyBindingHandler(event, editor, dispatch, currentPageId)

        return onKeyDownMention(event, editor)
    }, [index, search, target])

    useEffect(() => {
        journalFetcher(false).then(res => {
            const thisIsBad = res as JournalEntry[]
            if (!thisIsBad) return
            const slateJournalNodes = thisIsBad.flatMap(convertJournalEntryToSlateNodes)
            const bodyContent: Node[] = [{ children: slateJournalNodes }]

            const [lastDateLoaded] = thisIsBad.map(je => je.entry_date).slice(-1)
            setLastLoadedDate(lastDateLoaded)

            // @ts-ignore
            setJournalContent(bodyContent)
            setSelection(editor)
        })
    }, [])

    const syncJournalEntries = (newValue: Node[]) => {
        console.log(`SYNC-ing`)
        const journalEntries = journal.body as JournalEntry[]
        if (newValue !== journalContent) {
            console.log(newValue)
            // Immediately update component state
            // @ts-ignore
            setJournalContent(newValue)

            const rawSlateNodes = newValue[0].children as Node[]
            // Find the modified entries --> Bulk update to DB and sync to redux
            const newEntries: JournalEntry[] = rawSlateNodes.filter(n => n.type === JOURNAL_ENTRY).map(slateNode => convertSlateNodeToJournalEntry(slateNode, currentUser.id))

            const modifiedEntries = newEntries.filter((je, index) => JSON.stringify(je.body) !== JSON.stringify(journalEntries[index].body))
            saveBulkJournalEntries(modifiedEntries)
            onChangeMention(editor);
        }
    }

    useBottomScrollListener(() => {
        setLoading(true)
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
                message.info("You have reached the beginning!")
            }
            setLoading(false)
        })
    });

    const isEmpty =  equals(journalContent, initialContent)
    return (
        <div className={cn("peak-user-home", isEmpty ? "empty" : "")}>
            {(isEmpty) ? <EmptyJournal/> :
                <Slate
                    editor={editor}
                    value={journalContent}
                    onChange={syncJournalEntries}>
                    <MemoizedLinkMenu
                        key={`${currentPageId}-LinkMenu`}
                        linkState={journal.editorState.currentLinkState}
                        showLinkMenu={journal.editorState.showLinkMenu}
                        pageId={currentPageId}/>
                    <EditablePlugins
                        onKeyDown={[keyBindingHandler]}
                        onKeyDownDeps={[index, search, target]}
                        style={{
                            display: "flex",
                            textAlign: "left",
                            flex: "1 1 auto",
                            minWidth: "100%"
                        }}
                        plugins={journalPlugins}
                        autoFocus={true}
                    />
                    {(isLoading) ? <Skeleton active paragraph title/> : null}
                    <NodeContentSelect
                        at={target}
                        valueIndex={index}
                        options={values as PeakEditorControl[]}
                        onClickMention={onAddNodeContent}
                    />
                </Slate>
            }
        </div>
    )
};

const EmptyJournal = (props: {}) => (
    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={
        "Failed to load your Journal. Try refreshing."
    }/>
)

export default Journal
