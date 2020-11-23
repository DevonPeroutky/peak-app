import {ReactEditor, RenderElementProps, useEditor} from "slate-react";
import React, {useCallback, useRef, useState} from "react";
import "./peak-learning.scss"
import { Select } from 'antd';
import {useCurrentWikiPage} from "../../../../../utils/hooks";
import {setEditorFocusToNode} from "../../../../../redux/wikiPageSlice";
import {useDispatch} from "react-redux";
import {Editor, Transforms, Node} from "slate";
import {PEAK_LEARNING} from "../defaults";
import {TagOutlined} from "@ant-design/icons/lib";
import {filter} from "ramda";
const { Option } = Select;

export interface PeakTag {
    id: string
    value: string
    label?: string
    color?: string
}

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
    const [tags, setTags] = useState<PeakTag[]>([{id: "0", value: "Product Management"}])
    const [selectedTags, setSelectedTags] = useState<PeakTag[]>([])
    const [currentSearch, setCurrentSearch] = useState<string>("")
    const prefix = "Create new tag: "

    const onSelect = (tagName: string) => {
        console.log("SELECTING")
        console.log(tagName)
        const existingTag = tags.find(t => t.value === (tagName))
        if (existingTag) {
            setSelectedTags([...selectedTags, existingTag])
        } else {
            setTags([...tags, {id: "CHANGE THIS", value: tagName}])
            setSelectedTags([...selectedTags, {id: "CHANGE THIS", value: tagName}])
        }
    }
    const onDeselect = (tagName: string) => {
        setSelectedTags(selectedTags.filter(tag => tag.value !== tagName))
    }
    const handleInputKeyDown = (event) => {
        if (event.key === 'Enter' && !open) {
            event.preventDefault()
            leaveDown()
        } else if (event.key === "Escape") {
            setDropdownState(false)
            mainRef.current.focus()
        } else if (["ArrowDown", "ArrowUp"].includes(event.key) && !open) {
            (event.key === "ArrowDown") ? leaveDown() : leaveUp()
        }
    }

    const leaveDown = () => {
        const [match] = Editor.nodes(editor, { match: n => n.type === PEAK_LEARNING && n.id === nodeId, at: []});

        if (match) {
            const codeNode = match[0]
            const pathToCodeEditor = ReactEditor.findPath(editor, codeNode)
            const nextLocation = Editor.after(editor, pathToCodeEditor, { unit: "block" })
            Transforms.select(editor, nextLocation!)
            ReactEditor.focus(editor)
        } else {
            console.log("NO MATCH???")
        }
    }
    const leaveUp = () => {
        const [theNode, path] = Editor.nodes(editor, { match: n => n.type === PEAK_LEARNING && n.id === nodeId, at: []});
        const [lastChildNode, wtf] = (theNode[0].children as Node[]).slice(-1)
        const lastChildNodePath = ReactEditor.findPath(editor, lastChildNode)
        Transforms.select(editor, lastChildNodePath)
        Transforms.collapse(editor, { edge: "end"})
        ReactEditor.focus(editor)
    }
    const lockFocus = (shouldFocus: boolean) => {
        dispatch(setEditorFocusToNode({pageId: currentWikiPage.id, nodeId: nodeId, focused: shouldFocus}))
    }

    const CREATE_NEW_TAG_OPTION: PeakTag = { id: "TEMP ONLY", value: currentSearch, label: `Create new tag: ${currentSearch}` }
    const filteredTags: PeakTag[] = tags.filter(o => !selectedTags.map(t => t.id).includes(o.id));


    const isEmptyInput: boolean = currentSearch.length === 0
    const isSearched: boolean = filteredTags.find(t => t.value === currentSearch) === undefined
    const isExistingTag: boolean = tags.find(t => t.value === CREATE_NEW_TAG_OPTION.value) !== undefined
    const renderedTagList: PeakTag[] = (!isEmptyInput && !isExistingTag ) ? [...filteredTags, CREATE_NEW_TAG_OPTION] : filteredTags
    console.log(`---------`)
    console.log(`Selected Tags`)
    console.log(tags)
    console.log(selectedTags)
    console.log(filteredTags)
    console.log(renderedTagList)
    return (
        <div className={"peak-learning-select-container"} data-slate-editor >
            <TagOutlined className={"peak-tag-icon"}/>
            <Select
                onClick={() => {
                    console.log('ON FOCUS-ish')
                    setDropdownState(true)
                    lockFocus(true)
                }}
                ref={mainRef}
                onBlur={() => {
                    console.log(`BLURRED`)
                    lockFocus(false)
                    setDropdownState(false)
                }}
                open={open}
                onFocus={() => {
                    console.log(`Getting FOCUSED`)
                    setDropdownState(true)
                }}
                onInputKeyDown={handleInputKeyDown}
                onSearch={(value) => {
                    setDropdownState(true)
                    setCurrentSearch(value)
                }}
                optionLabelProp="value"
                mode="multiple"
                value={selectedTags.map(t => t.value)}
                bordered={false}
                placeholder="Tag this information for later"
                onSelect={onSelect}
                onDeselect={onDeselect}
                notFoundContent={null}
                style={{ width: '100%' }}>
                {renderedTagList.map(tag => (
                    <Option key={tag.id} value={tag.value as string}>
                        {tag.label || tag.value}
                    </Option>
                ))}
            </Select>
        </div>
    )
}