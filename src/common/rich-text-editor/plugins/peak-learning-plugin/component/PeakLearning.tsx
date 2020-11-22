import {ReactEditor, RenderElementProps, useEditor} from "slate-react";
import React, {useCallback, useRef, useState} from "react";
import "./peak-learning.scss"
import { Select } from 'antd';
import {useCurrentWikiPage} from "../../../../../utils/hooks";
import {setEditorFocusToNode} from "../../../../../redux/wikiPageSlice";
import {useDispatch} from "react-redux";
import {Editor, Transforms} from "slate";
import {ELEMENT_CODE_BLOCK, renderElementParagraph} from "@udecode/slate-plugins";
import {PEAK_LEARNING} from "../defaults";
const { Option } = Select;


export const PeakLearning = (props: RenderElementProps) => {
    const { element } = props

    return (
        <div className={"peak-learning-container"} {...props.attributes} key={0} tabIndex={0}>
            {props.children}
            <PeakLearningSelect nodeId={element.id as string}/>
        </div>
    )
}

const PeakLearningSelect = (props: { nodeId: string }) => {
    const { nodeId } = props
    const dispatch = useDispatch()
    const editor = useEditor()
    const mainRef = useRef(null);
    const [open, setDropdownState] = useState(false);
    const currentWikiPage = useCurrentWikiPage();

    const shouldFocus: boolean = currentWikiPage.editorState.focusMap[nodeId] || false
    if (shouldFocus) {
        mainRef.current.focus()
    }

    const children = [];
    for (let i = 10; i < 36; i++) {
        // @ts-ignore
        children.push(<Option key={i.toString(36) + i}>{i.toString(36) + i}</Option>);
    }
    const handleChange = (value) => {
        console.log(`Selected ${value}`)
    }

    const handleInputKeyDown = (event) => {
        console.log(event.key)
        if (event.key === 'Enter' && !open) {
            event.preventDefault()
            leave("down")
        } else if (event.key === "Escape") {
            setDropdownState(false)
        } else if (["ArrowDown", "ArrowUp"].includes(event.key) && !open) {
            leave((event.key === "ArrowDown") ? "down" : "up")
        }
    }

    const leave = (direction: "up" | "down") => {
        const [match] = Editor.nodes(editor, { match: n => n.type === PEAK_LEARNING && n.id === nodeId, at: []});

        if (match) {
            const codeNode = match[0]
            const pathToCodeEditor = ReactEditor.findPath(editor, codeNode)
            const nextLocation = (direction === "down") ? Editor.after(editor, pathToCodeEditor, { unit: "block" }) : Editor.before(editor, pathToCodeEditor, { unit: "block" })
            Transforms.select(editor, nextLocation!)
            ReactEditor.focus(editor)
        } else {
            console.log("NO MATCH???")
        }
    }

    const lockFocus = (shouldFocus: boolean) => {
        // wikiSave.cancel()
        dispatch(setEditorFocusToNode({pageId: currentWikiPage.id, nodeId: nodeId, focused: shouldFocus}))
    }
    return (
        <div className={"peak-learning-select-container"} data-slate-editor >
            <Select
                ref={mainRef}
                onBlur={() => {
                    lockFocus(false)
                    setDropdownState(false)
                }}
                onInputKeyDown={handleInputKeyDown}
                onSearch={() => setDropdownState(true)}
                open={open}
                mode="tags"
                style={{ width: '100%' }}
                placeholder="Tag this information for later"
                onChange={handleChange}>
                {children}
            </Select>
        </div>
    )
}