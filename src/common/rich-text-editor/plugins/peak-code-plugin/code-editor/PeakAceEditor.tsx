import React, {useRef} from "react";
import ReactAce from "react-ace";
import {message} from "antd";
import AceEditor from "react-ace";
import "ace-builds";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/mode-typescript";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-batchfile";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/mode-scala";
import "ace-builds/src-noconflict/mode-elixir";
import "ace-builds/src-noconflict/mode-xml";
import "ace-builds/src-noconflict/mode-css";
import "ace-builds/src-noconflict/mode-csharp";
import "ace-builds/src-noconflict/mode-html";
import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/mode-scss";
import "ace-builds/src-noconflict/mode-less";
import "ace-builds/src-noconflict/mode-mysql";
import "ace-builds/src-noconflict/mode-sass";
import "ace-builds/src-noconflict/mode-markdown";
import "ace-builds/src-noconflict/mode-handlebars";
import "ace-builds/src-noconflict/mode-makefile";
import "ace-builds/src-noconflict/mode-golang";
import "ace-builds/src-noconflict/mode-ruby";
import "ace-builds/src-noconflict/theme-dracula";
import "ace-builds/src-noconflict/theme-solarized_dark";
const copy = require('../../../../../assets/icons/copy.svg');

const ace = require('ace-builds/src-noconflict/ace');
ace.config.set("basePath", "https://cdn.jsdelivr.net/npm/ace-builds@1.4.3/src-noconflict/");
ace.config.setModuleUrl('ace/mode/javascript_worker', "https://cdn.jsdelivr.net/npm/ace-builds@1.4.3/src-noconflict/worker-javascript.js");

interface PeakCodeEditorProps {
    shouldFocus: boolean,
    updateLanguage: (newLanguage: string) => void,
    updateFocus: (shouldFocus: boolean) => void,
    codeBlockValue: string,
    isEditing: boolean,
    onCodeChange: (newValue: string) => void,
    saveCode: (newValue: string) => void,
    leaveUp: () => void,
    leaveDown: () => void,
    language: string,
    exitBreak: () => void,
    deleteCodeBlock: (e: any) => void
}

function PeakAceEditor(props: PeakCodeEditorProps) {
    const { leaveUp, leaveDown, exitBreak, saveCode, shouldFocus, updateFocus, codeBlockValue, onCodeChange, language, isEditing, deleteCodeBlock } = props
    const codeEditorRef = useRef<ReactAce | null>(null)
    const copyToClipboard = () => {
        message.warning("Copy code to clipboard, not implemented yet!")
    }

    const isEmpty = () => {
        return codeEditorRef.current!.editor.getValue() === ""
    }

    const isAtBeginning = () => {
        const row = codeEditorRef.current!.editor.selection.cursor.row
        const col = codeEditorRef.current!.editor.selection.cursor.column
        return row === 0 && col === 0
    }

    const isAtEnd = () => {
        if (isEmpty()) {
            return true
        }
        const content = codeEditorRef.current!.editor.selection.doc.$lines
        const row = codeEditorRef.current!.editor.selection.cursor.row
        const col = codeEditorRef.current!.editor.selection.cursor.column
        const lastLine = content[content.length - 1]
        return ((row === content.length - 1 || content.length === 0) && (col === lastLine.length || lastLine.length === 0))
    }

    const moveUpDown = (direction: "up" | "down") => {
        if (isAtBeginning() && direction === "up") {
            leaveUp()
            return
        }

        if (isAtEnd() && direction === "down") {
            leaveDown()
            return
        }
        if (direction === "up") {
            codeEditorRef.current!.editor.navigateUp(1)
        } else {
            codeEditorRef.current!.editor.navigateDown(1)
        }

    }

    return (
        <div className={"peak-ace-editor-container"}
             data-slate-editor
             tabIndex={0}
        >
            {(isEditing) ? null : <img src={copy} alt={"Copy Code"} onClick={copyToClipboard} className={"code-copy-icon"}/> }
            <AceEditor
                mode={language}
                ref={codeEditorRef}
                focus={shouldFocus}
                onLoad={() => {
                    // codeEditorRef.current!.editor.selection.cursor.onChange
                }}
                onFocus={() => {
                    if (shouldFocus) {
                        updateFocus(true)
                    }
                }}
                onBlur={() => {
                    console.log(`BLURRRING?!??!?!?!`)
                    updateFocus(false)
                    saveCode(codeBlockValue)
                }}
                readOnly={!isEditing}
                className={"peak-ace-editor"}
                theme="dracula"
                name="blah2"
                onChange={(v, e) => onCodeChange(v)}
                fontSize={14}
                showPrintMargin={false}
                showGutter={false}
                highlightActiveLine={false}
                minLines={1}
                maxLines={25}
                value={codeBlockValue}
                // keyboardHandler={"vim"}
                commands={[
                    {
                        name: 'delete-break',
                        bindKey: {win: 'Meta+Backspace', mac: 'Meta+Backspace'},
                        exec: () => {
                            deleteCodeBlock(null)
                        }
                    },
                    {
                        name: 'enter-break',
                        bindKey: {win: 'Meta+Enter', mac: 'Meta+Enter'},
                        exec: () => {
                            exitBreak()
                        }
                    },
                    {
                        name: 'leaver-up',
                        bindKey: {win: 'Up', mac: 'Up'},
                        exec: () => {
                            moveUpDown("up")
                        }
                    },
                    {
                        name: 'leaver-down',
                        bindKey: {win: 'Down', mac: 'Down'},
                        exec: () => {
                            moveUpDown("down")
                        }
                    }
                ]}
                setOptions={{
                    tabSize: 2,
                }}/>
            {isEditing && shouldFocus ? <span className="delete-instructions">Delete the Code Block with ⌘ + Backspace</span> : null }
        </div>
    )
}

export default PeakAceEditor
