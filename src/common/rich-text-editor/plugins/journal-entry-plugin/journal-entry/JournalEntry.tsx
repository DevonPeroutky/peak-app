import React from "react"; import "./journal-entry.scss"
import {Dropdown, Menu, message, Select} from "antd";
import cn from "classnames";
import {formatDate, getCurrentFormattedDate} from "../../../../../utils/time";
import {all, any, equals} from "ramda"
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
import {ELEMENT_LI, ELEMENT_OL, ELEMENT_PARAGRAPH, ELEMENT_UL, isList} from "@udecode/slate-plugins";

const isNodeEmpty = (theChildren: Node[]) => {
    if (theChildren.length != 1) { return false }
    const theNode = theChildren[0]
    const nodeText = Node.string(theNode)
    return theNode.type === ELEMENT_PARAGRAPH && nodeText.length === 0
}

export const JournalEntryBody = (props: { entry_date: string, attributes: any, children: any, element: any }) => {
    const isEmpty: boolean = isNodeEmpty(props.element.children)
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
    const isEmpty = isNodeEmpty(journal.body[0].body)

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
            // Set today's journal entry in Database
            const secondNewestDay: JournalEntry = journalEntries[1]
            const newFirstDay: JournalEntry = {...journalEntries[0], body: secondNewestDay.body}
            await saveBulkJournalEntries([newFirstDay])

            // Get first entry location in Slate Editor
            const [firstJournalEntry] = Editor.nodes(editor, {
                at: [],
                match: n => (n.type === JOURNAL_ENTRY && n.entry_date === newFirstDay.entry_date),
            })

            // Set today's journal entry in Slate
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

            // Get Uncompleted Tasks from yesterday
            const [secondJournalEntry] = Editor.nodes(editor, {
                at: [],
                match: n => (n.type === JOURNAL_ENTRY && n.entry_date === secondNewestDay.entry_date),
            })
            const topLevelListNodes: Node[] = (secondJournalEntry[0].children as Node[]).filter(n => [ELEMENT_UL, ELEMENT_OL].includes(n.type as string))
            const newNodes: Node[] = topLevelListNodes.map(buildIncompleteTask)

            // Set today's journal entry in Database
            const newFirstDay: JournalEntry = {...journalEntries[0], body: newNodes}
            await saveBulkJournalEntries([newFirstDay])

            // Get first entry location in Slate Editor
            const [firstJournalEntry] = Editor.nodes(editor, {
                at: [],
                match: n => (n.type === JOURNAL_ENTRY && n.entry_date === newFirstDay.entry_date),
            })

            // Set today's journal entry in Slate
            const newJournalEntry: JournalEntry = { entry_date: journalEntries[0].entry_date, body: newNodes }
            const newSlateNode: Node = convertJournalEntryToSlateNodes(newJournalEntry)[1]
            await Transforms.removeNodes(editor, { at: firstJournalEntry[1] })
            await Transforms.insertNodes(editor, newSlateNode, { at: firstJournalEntry[1] })
            await setSelection(editor)
        }
    };

    const isUncompletedNode: (n: Node) => Node | null = (n: Node) => {
        console.log(`EVALUATING`)
        console.log(n)
        console.log(n.children)
        const isAllUncompleted = all((node: Node) => {
            console.log(`FUCK YOU MEAN`)
            console.log(node)
            console.log(node.completed)
            // @ts-ignore
            return !node.completed
        }, n.children as Node[])
        console.log(`IS UNCOMPLETED??: ${isAllUncompleted}`)
        return isAllUncompleted ? n : null
    }

    const buildIncompleteTask: (n: Node) => Node | null = (n: Node) => {
        // Base Case --> Return the paragraph node or nothing (if completed)?
        // How to best represent "nothing"?
        if (n.type === ELEMENT_PARAGRAPH) {
            console.log(`LEAF NODE!`)
            return isUncompletedNode(n)
        }

        // UL || OL
        if ([ELEMENT_UL, ELEMENT_OL].includes(n.type as string)) {
            const children: Node[] = (n.children as Node[]).map(buildIncompleteTask).filter(n => n != null)
            return (children.length == 0) ? null : {type: n.type, children: children}
        }

        // LI
        if (ELEMENT_LI === n.type as string) {
            const childrenCount: number = (n.children as Node[]).length
            if (childrenCount == 2) {
                const paragraphNode: Node = (n.children as Node[])[0]
                const subListNode: Node = (n.children as Node[])[1]
                const isUncompleted: Node | null = isUncompletedNode(paragraphNode)
                return isUncompleted !== null ? { type: ELEMENT_LI, children: [paragraphNode, buildIncompleteTask(subListNode)].filter(n => n != null) } : null
            } else if (childrenCount == 1) {
                const paragraphNode: Node = (n.children as Node[])[0]
                const isUncompleted: Node | null = isUncompletedNode(paragraphNode)
                return isUncompleted !== null ? n : null
            } else {
                return null
            }
        }
        return null
    }

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
