import React from "react"; import "./journal-entry.scss"
import {Dropdown, Menu, message, Select} from "antd";
import cn from "classnames";
import {formatDate, getCurrentFormattedDate} from "../../../../../utils/time";
import {equals} from "ramda"
import {JournalEntry, PeakWikiPage, updateJournalEntries} from "../../../../../redux/wikiPageSlice";
import {Editor, Transforms, Node} from 'slate';
import {useDebounceBulkJournalEntrySaver, useJournal, useJournalSaver} from "../../../../../utils/hooks";
import {ScheduleOutlined} from "@ant-design/icons/lib";
import {useDispatch} from "react-redux";
import {EMPTY_NODE} from "../../../journal/constants";
import {ReactEditor, useSlate} from "slate-react";
import {JOURNAL_ENTRY, PEAK_STRIKETHROUGH_OPTIONS} from "../../../constants";
import {convertJournalEntryToSlateNodes} from "../../../journal/utils";
import {useSelectFirstJournalEntry} from "../utils";
import {PEAK_MARK_COMPLETED} from "../../completed-plugin/CompletedPlugin";

export const JournalEntryBody = (props: { entry_date: string, attributes: any, children: any, element: any }) => {
    const theChildren = props.element.children
    const emptyNode = [{ type: "p", children: [{text: ""}]}]
    const isEmpty: boolean = equals(theChildren, emptyNode)
    return (
        <div
            className={cn("peak-journal-entry", (getCurrentFormattedDate() == props.entry_date) ? "today" : "not-today", (isEmpty) ? "empty-journal" : "" )}
            {...props.attributes}>
            {props.children}
        </div>
    )
}

export const JournalEntryHeader = (props: { entry_date: string, attributes: any, children: any, element: any }) => {
    const isToday: boolean = getCurrentFormattedDate() == props.entry_date
    const journal: PeakWikiPage = useJournal()
    const isEmpty: boolean = equals(journal.body[0].body, EMPTY_NODE)

    return (
        <div className={"peak-journal-entry-header"} {...props.attributes} contentEditable={false}>
            <h1 className="peak-je-title" onClick={(e) => {
                message.info({
                    content: "Nah don't change the journal date",
                    key: 1
                })
                e.preventDefault()
            }}>
                {(isToday) ? "Today" : props.entry_date}
            </h1>
            {(isToday && isEmpty) ? <ToDoCopyOverSelect /> : null}
            <div style={{ height: 0, overflow: "hidden" }}>{props.children}</div>
        </div>
    )
}

const ToDoCopyOverSelect = (props: {}) => {
    const journal = useJournal()
    const setSelection = useSelectFirstJournalEntry()
    const editor = useSlate()
    const saveBulkJournalEntries = useDebounceBulkJournalEntrySaver()

    const copyAllToDos = async () => {
        const journalEntries: JournalEntry[] = journal.body as JournalEntry[]
        if (journalEntries.length > 1) {
            const secondNewestDay: JournalEntry = journalEntries[1]
            const newFirstDay: JournalEntry = {...journalEntries[0], body: secondNewestDay.body}
            await saveBulkJournalEntries([newFirstDay])
            const [firstJournalEntry] = Editor.nodes(editor, {
                at: [],
                match: n => (n.type === JOURNAL_ENTRY && n.entry_date === newFirstDay.entry_date),
            })

            const newJournalEntry: JournalEntry = { entry_date: journalEntries[0].entry_date, body: secondNewestDay.body }
            const newSlateNode: Node = convertJournalEntryToSlateNodes(newJournalEntry)[1]
            await Transforms.removeNodes(editor, { at: firstJournalEntry[1] })
            await Transforms.insertNodes(editor, newSlateNode, { at: firstJournalEntry[1] })
            await setSelection(editor)
        }
    };

    const copyInProgressToDos = async () => {
        const journalEntries: JournalEntry[] = journal.body as JournalEntry[]
        if (journalEntries.length > 1) {
            const secondNewestDay: JournalEntry = journalEntries[1]
            const newFirstDay: JournalEntry = {...journalEntries[0], body: secondNewestDay.body}
            await saveBulkJournalEntries([newFirstDay])
            const [firstJournalEntry] = Editor.nodes(editor, {
                at: [],
                match: n => (n.type === JOURNAL_ENTRY && n.entry_date === newFirstDay.entry_date),
            })
            const [secondJournalEntry] = Editor.nodes(editor, {
                at: [],
                match: n => (n.type === JOURNAL_ENTRY && n.entry_date === secondNewestDay.entry_date),
            })

            console.log(`BRUG`)
            const [je] = Editor.nodes(editor, {
                at: [],
                mode: "all",
                match: n => {
                    console.log("THE MAKKS")
                    console.log(n)
                    return (n.type === JOURNAL_ENTRY && n.entry_date === secondNewestDay.entry_date)
                },
            })
            console.log(je)

            const newJournalEntry: JournalEntry = { entry_date: journalEntries[0].entry_date, body: secondNewestDay.body }
            const newSlateNode: Node = convertJournalEntryToSlateNodes(newJournalEntry)[1]
            await Transforms.removeNodes(editor, { at: firstJournalEntry[1] })
            await Transforms.insertNodes(editor, newSlateNode, { at: firstJournalEntry[1] })
            await setSelection(editor)
        }
    };

    const menu = (
        <Menu>
            <Menu.Item onClick={copyInProgressToDos}>Copy Incomplete To-Do's</Menu.Item>
            <Menu.Item onClick={copyAllToDos}>Copy All To-Do's</Menu.Item>
        </Menu>
    );

    return (
        <Dropdown overlay={menu}>
            <ScheduleOutlined />
        </Dropdown>
    )
}
