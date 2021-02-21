import {Editor, Node, Transforms} from "slate";
import {JOURNAL_ENTRY} from "../../types";
import {isCurrentDay} from "../../../../utils/time";
import {useJournal} from "../../../../utils/hooks";
import {convertJournalEntryToSlateNodes} from "../../editors/journal/utils";
import {JournalEntry} from "../../editors/journal/types";

export const useSelectFirstJournalEntry = () => {
    const journal = useJournal()

    return (editor: Editor) => {
        const journalContent  = (journal.body as JournalEntry[]).flatMap(convertJournalEntryToSlateNodes)
        const slateJournalNodes: Node[] = journalContent[0].children as Node[]

        // Set Selection to end of the first node
        if (slateJournalNodes.length > 0) {
            const [node] = Editor.nodes(editor, {
                at: [],
                match: n => n.type === JOURNAL_ENTRY && n.entry_date && isCurrentDay(n.entry_date as string)
            })

            if (node && Node.string(node[0])) {
                Transforms.select(editor, node[1])
                Transforms.collapse(editor, {edge: "end"})
                // TODO: Detect IF there should be a new line
                // Editor.insertBreak(editor)
                // Transforms.select(editor, node[1])
                // Transforms.collapse(editor, {edge: "end"})
            } else if (node) {
                Transforms.select(editor, node[1])
                Transforms.collapse(editor, {edge: "end"})
            }
        } else {
            console.log(`Failed to fetch current day's entry?`)
        }
    }
}
