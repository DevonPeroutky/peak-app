import React from "react";
import {Dropdown, Menu, message, Select} from "antd";
import cn from "classnames";
import {formatDate, getCurrentFormattedDate} from "../../../../../utils/time";
import {all, any, equals} from "ramda"
import {JournalEntry, PeakWikiPage, updateJournalEntries} from "../../../../../redux/slices/wikiPageSlice";
import {Editor, Transforms, Node} from 'slate';
import {useJournal} from "../../../../../utils/hooks";
import {FileSyncOutlined} from "@ant-design/icons/lib";
import {useSelected, useSlate} from "slate-react";
import {JOURNAL_ENTRY} from "../../../types";
import {convertJournalEntryToSlateNodes} from "../../../editors/journal/utils";
import {ELEMENT_LI, ELEMENT_OL, ELEMENT_PARAGRAPH, ELEMENT_UL, isList} from "@udecode/slate-plugins";
import "./journal-entry.scss";

export const isNodeEmpty = (node: Node) => {
    const theChildren: Node[] = node.children as Node[]
    if (!theChildren || theChildren.length != 1) { return false }
    const theNode = theChildren[0]
    const nodeText = Node.string(theNode)
    return theNode.type === ELEMENT_PARAGRAPH && nodeText.length === 0
}

export const JournalEntryBody = (props: { entry_date: string, attributes: any, children: any, element: any }) => {
    const isEmpty: boolean = isNodeEmpty(props.element)
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
            {/*{(isToday && isEmpty) ? <ToDoCopyOverSelect /> : null}*/}
            <div style={{ height: 0, overflow: "hidden" }}>{props.children}</div>
        </div>
    )
}

const ToDoCopyOverSelect = (props: {}) => {
    const journal = useJournal()
    // const setSelection = useSelectFirstJournalEntry()
    const editor = useSlate()
    // const saveBulkJournalEntries = useDebounceBulkJournalEntrySaver()

    // Common work
    const journalEntries: JournalEntry[] = journal.body as JournalEntry[]

    /**
     * Given the "new" first journal entry:
     * - Find the location of the first journal_entry_body
     * - Remove the nodes of the first journal_entry_body
     * - Insert the nodes of the "new" entry
     * - Set the selection
     *
     * @param newJournalEntry
     */
    const copyContentFromPreviousToCurrent = async (newJournalEntry: JournalEntry) => {
        // Get first entry location in Slate Editor
        const [firstJournalEntry] = Editor.nodes(editor, {
            at: [],
            match: n => (n.type === JOURNAL_ENTRY && n.entry_date === newJournalEntry.entry_date),
        })
        const newSlateNode: Node = convertJournalEntryToSlateNodes(newJournalEntry)[1]

        // TODO: Can we do this in one step?
        await Transforms.removeNodes(editor, { at: firstJournalEntry[1] })
        await Transforms.insertNodes(editor, newSlateNode, { at: firstJournalEntry[1] })
        // await setSelection(editor)
        return
    }

    const copyAllToDos = async () => {
        if (journalEntries.length > 1) {
            // Set today's journal entry in Database
            const secondNewestDay: JournalEntry = journalEntries[1]
            const newFirstDay: JournalEntry = {...journalEntries[0], body: secondNewestDay.body}
            // await saveBulkJournalEntries([newFirstDay])
           await copyContentFromPreviousToCurrent(newFirstDay)
        }
    };

    const copyInProgressToDos = async () => {
        if (journalEntries.length > 1) {
            const secondNewestDay: JournalEntry = journalEntries[1]

            // Get Uncompleted Tasks from yesterday
            const [secondJournalEntry] = Editor.nodes(editor, {
                at: [],
                match: n => (n.type === JOURNAL_ENTRY && n.entry_date === secondNewestDay.entry_date),
            })
            const topLevelListNodes: Node[] = (secondJournalEntry[0].children as Node[]).filter(n => [ELEMENT_UL, ELEMENT_OL].includes(n.type as string))
            const newNodes: Node[] = topLevelListNodes.map(buildIncompleteTask)
            const newFirstDay: JournalEntry = {...journalEntries[0], body: newNodes}

            // await saveBulkJournalEntries([newFirstDay])
            await copyContentFromPreviousToCurrent(newFirstDay)
        }
    };

    const isUncompletedNode: (n: Node) => Node | null = (n: Node) => {
        const isAllUncompleted = all((node: Node) => {
            // @ts-ignore
            return !node.completed
        }, n.children as Node[])
        return isAllUncompleted ? n : null
    }

    const buildIncompleteTask: (n: Node) => Node | null = (n: Node) => {
        // Base Case --> Return the paragraph node or nothing (if completed)?
        // How to best represent "nothing"?
        if (n.type === ELEMENT_PARAGRAPH) {
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
        <Dropdown overlay={menu} overlayClassName={"copy-over-icon-container"} className={"copy-over-icon-container"}>
            <FileSyncOutlined className={"copy-over-icon animated slideIn"}/>
        </Dropdown>
    )
}
