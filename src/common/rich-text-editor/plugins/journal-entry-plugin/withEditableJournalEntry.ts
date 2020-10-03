import {Editor, Path, Range, Node} from "slate";
import {ReactEditor} from "slate-react";
import {isSelectionAtBlockStart} from "@udecode/slate-plugins";
import {JOURNAL_ENTRY_HEADER} from "../../constants";

export const withEditableJournalEntry = <T extends ReactEditor>(editor: T) => {
    const { isVoid, deleteBackward, deleteFragment } = editor

    // Do NOT allow the user to delete the JournalEntry Header
    editor.deleteBackward = unit => {
        const currentPath = editor.selection?.anchor.path

        if (currentPath) {
            const [previousNode, path] = Editor.previous(editor, {})
            const selectionCollapsedAndAtStart: boolean = isSelectionAtBlockStart(editor) && Range.isCollapsed(editor.selection!)
            if (previousNode.type === JOURNAL_ENTRY_HEADER && selectionCollapsedAndAtStart) {
                return
            }
        }

        return deleteBackward(unit)
    }

    // If the user highlights from one Journal Entry to another, do NOT let them delete. As this would essentially allow them
    // remove the JournalEntry Header
    editor.deleteFragment = () => {
        const frag = Node.fragment(editor, editor.selection!)

        // const selectionSpanMultipleNodes: boolean = !Path.equals(editor.selection!.anchor.path, editor.selection!.focus.path)
        const nodesInSelection: Node[] = Node.fragment(editor, editor.selection!) as Node[]

        const journalEntryHeadersInSelection: boolean = nodesInSelection.some(n => n.type === JOURNAL_ENTRY_HEADER)
        if (journalEntryHeadersInSelection) {
            return
        }
        return deleteFragment()
    }

    return editor
};
