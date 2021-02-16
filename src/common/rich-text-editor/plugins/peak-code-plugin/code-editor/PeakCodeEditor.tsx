import React, {useEffect, useState} from 'react'
import {Editor, Node, Transforms} from 'slate';
import {useEditor} from 'slate-react'
import {
    useCurrentPage,
    useSavePageRequest,
    useDebounceWikiSaver,
    useDebounceBulkJournalEntrySaver, useCurrentUser
} from '../../../../../utils/hooks';
import { useDispatch } from 'react-redux';
import {updatePageContents} from '../../../../../redux/slices/wikiPageSlice';
import "./peak-code-editor.scss"
import {LanguageContextBar} from "./LanguageContextBar";
import PeakAceEditor from "./PeakAceEditor";
import {ELEMENT_CODE_BLOCK} from "@udecode/slate-plugins";
import {forceFocusToNode, reEnterDown, reEnterUp} from "../../../utils/external-editor-utils";
import {JOURNAL_PAGE_ID} from "../../../editors/journal/constants";
import {JournalEntry} from "../../../editors/journal/types";
import {findNode} from "../../../utils/base-utils";
import {useActiveEditorState} from "../../../../../redux/slices/activeEditor/activeEditorSlice";

const PeakCodeEditor = (props: { attributes: any, children: any, element: any }) => {
    const { element  } = props;
    const editor = useEditor()
    const matchFunc = (n: Node) => n.type === ELEMENT_CODE_BLOCK && n.id === element.id

    // Hooks
    const currentUser = useCurrentUser()
    const currentWikiPage = useCurrentPage();
    const editorState = useActiveEditorState();
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
        }
    };
    const updateLanguage = (newLanguage: string) => {
        if (newLanguage !== language) {
            updateWikiBody({ language: newLanguage })
        }
    }

    // TODO: HOW TO DO THIS IN A JOURNAL??????
    const updateWikiBody = (payload: {}) => {

        if (currentWikiPage.id !== JOURNAL_PAGE_ID) {
            // @ts-ignore
            const bro: Node[] = currentPageNodes[0] as Node[]
            // @ts-ignore
            const childNodes: Node[] = bro.children as Node[]
            const updatedNodes: Node[] = childNodes.map(n => (n.id && n.id === props.element.id) ? {...n, ...payload} : n)

            const newBody: Node[] = [{
                children: updatedNodes
            }]

            savePageToDB(newBody, currentWikiPage.title, currentWikiPage.id).then(res => {
                dispatch(updatePageContents({ pageId: currentWikiPage.id, body: newBody, title: currentWikiPage.title }))
            })
        } else {
            const journalEntries: JournalEntry[] = currentPageNodes as JournalEntry[]

            // @ts-ignore
            const responsibleJournalEntry: JournalEntry | undefined = journalEntries.find(je => je.body.map(n => n.id).includes(props.element.id))

            if (!responsibleJournalEntry) {
                console.log(`WHAT THE FUCK`)
            } else {
                // @ts-ignore
                const updatedJournalBody = responsibleJournalEntry.body.map(n => (n.id && n.id === props.element.id && n.type === ELEMENT_CODE_BLOCK) ? {...n, ...payload} : n)
                const newJournalEntry: JournalEntry = {...responsibleJournalEntry, body: updatedJournalBody}
                saveBulkJournalEntries([newJournalEntry], currentUser)
            }
        }
    }

    // Callbacks
    const deleteCodeBlock = async (e: any) => {
        if (e) {
            e.preventDefault();
        }

        // await toggleNodeType(editor, { activeType: ELEMENT_CODE_BLOCK })
        const [node, nodePath] = findNode(editor, (n) => n.id && n.id === props.element.id && n.type === ELEMENT_CODE_BLOCK)
        await exitUp()
        await Transforms.delete(editor, {
            at: nodePath,
            distance: 1,
            unit: "block"
        })
    }

    const exitUp = () => {
        reEnterUp(editor, matchFunc)
    }
    const exitDown = () => {
        reEnterDown(editor, matchFunc)
    }
    const exitBreak = async () => {
        exitDown()
    }

    // Focus handler
    const lockFocus = (shouldFocusThis: boolean) => {
        wikiSave.cancel()
        console.log(`WE LOCKING IN FOCUS BRAH `, shouldFocusThis)
        forceFocusToNode(element, shouldFocusThis)
    }
    const shouldFocus: boolean = editorState.focusMap[element.id] || false
    console.log(`SHOULD BE FOCUSING: (${element.id}) `, shouldFocus)
    return (
        <div
            {...props.attributes}
            className={"editor-container"}
            style={{ witdth: "100%!important" }}
            tabIndex="0"
            key={element.id}
        >
            <div style={{ height: 0, overflow: "hidden" }}>{props.children}</div>
            <div className="code-block-container">
                <LanguageContextBar
                    codeId={props.element.id}
                    pageId={currentWikiPage.id}
                    updateLanguage={updateLanguage}
                    isEditing={editorState.isEditing}
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
                    isEditing={editorState.isEditing}
                    leaveDown={exitDown}
                    leaveUp={exitUp}
                    onCodeChange={setCodeBlock}
                    language={language}/>
            </div>
        </div>
    )
};

export default PeakCodeEditor