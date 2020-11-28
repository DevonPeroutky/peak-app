import React, {useEffect, useState} from 'react'
import {Editor, Node, NodeEntry, Path, Point, Transforms} from 'slate';
import {
    useEditor,
    ReactEditor,
} from 'slate-react'
import {
    useCurrentWikiPage,
    useSavePageRequest,
    useDebounceWikiSaver,
    useDebounceBulkJournalEntrySaver
} from '../../../../../utils/hooks';
import { useDispatch } from 'react-redux';
import {updatePageContents, setEditorFocusToNode, JournalEntry} from '../../../../../redux/wikiPageSlice';
import "./peak-code-editor.scss"
import {LanguageContextBar} from "./LanguageContextBar";
import PeakAceEditor from "./PeakAceEditor";
import {ELEMENT_CODE_BLOCK, ELEMENT_PARAGRAPH} from "@udecode/slate-plugins";
import {JOURNAL_PAGE_ID} from "../../../editors/journal/constants";
import {isAtLastLineOfLearning, next} from "../../../utils/editor-utils";
import {PEAK_LEARNING} from "../../peak-learning-plugin/defaults";

const PeakCodeEditor = (props: { attributes: any, children: any, element: any }) => {
    const { element  } = props;
    const editor = useEditor()

    // Hooks
    const currentWikiPage = useCurrentWikiPage();
    const dispatch = useDispatch();
    const savePageToDB = useSavePageRequest();
    const wikiSave = useDebounceWikiSaver();
    const saveBulkJournalEntries = useDebounceBulkJournalEntrySaver()

    // Derived props from hooks
    const daString = Node.string(props.element);
    const currentPageNodes = currentWikiPage.body;

    // Component State. The contents are being pulls directly from Slate
    const [codeBlock, setCodeBlock] = useState(daString || "");
    const [language, setLanguage] = useState(element.language || "batchfile");

    // Update State Callbacks
    const updateWikiPageContents = (newValue: string) => {
        if (daString !== newValue) {
            updateWikiBody({ children: [{text: newValue}]})
        } else {
        }
    };
    const updateLanguage = (newLanguage: string) => {
        if (newLanguage !== language) {
            updateWikiBody({ language: newLanguage })
        } else {
        }
    }

    // TODO: HOW TO DO THIS IN A JOURNAL??????
    const updateWikiBody = (payload: {}) => {

        if (currentWikiPage.id !== JOURNAL_PAGE_ID) {
            // @ts-ignore
            const bro: Node[] = currentPageNodes[0] as Node[]
            // @ts-ignore
            const childNodes: Node[] = bro.children as Node[]
            const updatedNodes: Node[] = childNodes.map(n => (n.code_id && n.code_id === props.element.code_id) ? {...n, ...payload} : n)

            const newBody: Node[] = [{
                children: updatedNodes
            }]

            savePageToDB(newBody, currentWikiPage.title, currentWikiPage.id).then(res => {
                dispatch(updatePageContents({ pageId: currentWikiPage.id, body: newBody, title: currentWikiPage.title }))
            })
        } else {
            const journalEntries: JournalEntry[] = currentPageNodes as JournalEntry[]

            // @ts-ignore
            const responsibleJournalEntry: JournalEntry | undefined = journalEntries.find(je => je.body.map(n => n.code_id).includes(props.element.code_id))

            if (!responsibleJournalEntry) {
                console.log(`WHAT THE FUCK`)
            } else {
                // @ts-ignore
                const updatedJournalBody = responsibleJournalEntry.body.map(n => (n.code_id && n.code_id === props.element.code_id) ? {...n, ...payload} : n)
                const newJournalEntry: JournalEntry = {...responsibleJournalEntry, body: updatedJournalBody}
                saveBulkJournalEntries([newJournalEntry])
            }
        }
    }

    // Callbacks
    const deleteCodeBlock = (e: any) => {
        if (e) {
            e.preventDefault();
        }
        leave("up")
        Transforms.removeNodes(editor, { at: [], match: node => node.code_id === element.code_id })
    }
    const leave = (direction: "up" | "down") => {
        const [match] = Editor.nodes(editor, { match: n => n.type === ELEMENT_CODE_BLOCK && n.code_id === element.code_id, at: []});

        if (!match) { return}
        if (direction === "down") {
            exitDown(match)
        } else {
            exitUp(match)
        }
    }

    const exitUp = (match: NodeEntry<Node>) => {
        const [currNode, currNodePath] = match

        const pathToCodeEditor = ReactEditor.findPath(editor, currNode)

        const [currParent, currParentPath] = Editor.parent(editor, currNodePath)

        // Get previous Node and its parent
        const [previousNode, previousNodePath] = Editor.previous(editor, {
            at: pathToCodeEditor,
            match: n => Editor.isBlock(editor, n),
            voids: true
        })
        const [previousParent, previousParentPath] = Editor.parent(editor, previousNodePath)
        console.log(`Current Parent`)
        console.log(currParent)
        console.log(`Previous Parent`)
        console.log(previousParent)


        if (previousParent && currParent && previousParent.type === PEAK_LEARNING && currParent.type !== PEAK_LEARNING) {
            dispatch(setEditorFocusToNode({ pageId: currentWikiPage.id, nodeId: previousParent.id as string, focused: true}))
        } else if (previousNode.type === ELEMENT_CODE_BLOCK) {
            dispatch(setEditorFocusToNode({ pageId: currentWikiPage.id, nodeId: previousNode.code_id as string, focused: true}))
        } else {
            Transforms.select(editor, previousNodePath)
            Transforms.collapse(editor, {edge: 'end'} )
            ReactEditor.focus(editor)
        }
    }
    const exitDown = (match: NodeEntry<Node>) => {
        const [currNode, currNodePath] = match
        if (isAtLastLineOfLearning(editor, match)) {
            console.log(`WE ARE AT THE last line of the learning`)
            console.log(currNode)
            const [currParent, currParentPath] = Editor.parent(editor, currNodePath)
            dispatch(setEditorFocusToNode({ pageId: currentWikiPage.id, nodeId: currParent.id as string, focused: true}))
            return
        }

        const pathToCodeEditor = ReactEditor.findPath(editor, match[0])
        // Get previous Node and its parent
        const [nextNode, nextNodePath] = Editor.next(editor, {
            at: pathToCodeEditor,
            match: n => Editor.isBlock(editor, n),
            voids: true
        })

        if (nextNode.type === ELEMENT_CODE_BLOCK) {
            dispatch(setEditorFocusToNode({ pageId: currentWikiPage.id, nodeId: nextNode.code_id as string, focused: true}))
        } else {
            Transforms.select(editor, nextNodePath)
            Transforms.collapse(editor, {edge: 'end'} )
            ReactEditor.focus(editor)
        }
    }
    const exitBreak = async () => {
        const empty_paragraph = {
            type: ELEMENT_PARAGRAPH,
            children: [{ text: "" }],
        }

        const transformFunc = () => {
            const [match] = Editor.nodes(editor, { match: n => n.type === ELEMENT_CODE_BLOCK && n.code_id === element.code_id, at: []});

            if (match) {
                const codeNode = match[0]
                const pathToCodeEditor = ReactEditor.findPath(editor, codeNode)
                const nextLocation = Editor.after(editor, pathToCodeEditor, { unit: "block" })
                Transforms.insertNodes(editor, empty_paragraph, { at: nextLocation })
            } else {
                console.log("NO MATCH???")
            }
        }

        const result = await transformFunc()
        leave("down")
    }

    // Focus handler
    const lockFocus = (shouldFocus: boolean) => {
        wikiSave.cancel()
        dispatch(setEditorFocusToNode({pageId: currentWikiPage.id, nodeId: element.code_id, focused: shouldFocus}))
    }
    const shouldFocus: boolean = currentWikiPage.editorState.focusMap[element.code_id] || false

    return (
        <div
            {...props.attributes}
            className={"editor-container"}
            style={{ witdth: "100%!important" }}
            tabIndex="0"
            key={element.code_id}
        >
            <div style={{ height: 0, overflow: "hidden" }}>{props.children}</div>
            <div className="code-block-container">
                <LanguageContextBar
                    codeId={props.element.code_id}
                    pageId={currentWikiPage.id}
                    updateLanguage={updateLanguage}
                    isEditing={currentWikiPage.editorState.isEditing}
                    deleteCodeBlock={deleteCodeBlock}
                    language={language}/>
                <PeakAceEditor
                    exitBreak={exitBreak}
                    deleteCodeBlock={deleteCodeBlock}
                    shouldFocus={shouldFocus}
                    saveCode={updateWikiPageContents}
                    updateLanguage={updateLanguage}
                    updateFocus={lockFocus}
                    codeBlockValue={codeBlock}
                    isEditing={currentWikiPage.editorState.isEditing}
                    leaveHandler={leave}
                    onCodeChange={setCodeBlock}
                    language={language}/>
            </div>
        </div>
    )
};

export default PeakCodeEditor