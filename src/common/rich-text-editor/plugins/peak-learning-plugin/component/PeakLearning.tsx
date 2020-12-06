import {ReactEditor, RenderElementProps, useEditor} from "slate-react";
import React, {useCallback, useRef, useState} from "react";
import "./peak-learning.scss"
import {Empty, Select, Tag} from 'antd';
import {useCurrentUser, useCurrentWikiPage} from "../../../../../utils/hooks";
import {setEditorFocusToNode, updatePageContents} from "../../../../../redux/wikiPageSlice";
import {useDispatch} from "react-redux";
import {Editor, Transforms, Node} from "slate";
import {PEAK_LEARNING} from "../defaults";
import {TagOutlined} from "@ant-design/icons/lib";
import {ELEMENT_CODE_BLOCK} from "@udecode/slate-plugins";
import {next, reEnterDown} from "../../../utils/editor-utils";
import {PeakTag, STUB_TAG_ID} from "../../../../../redux/tagSlice";
import {createPeakTags, useTags} from "../../../../../utils/requests";
import {calculateNextColor} from "../utils";
import {LabeledValue} from "antd/es/select";
const { Option } = Select;



export interface PeakDisplayTag {
    id: string
    title: string
    color?: string
    label?: string
}

export const PeakLearning = (props: RenderElementProps) => {
    const { element } = props
    const editor = useEditor()
    const path = ReactEditor.findPath(editor, props.element)
    const tags = element.selected_tags as PeakTag[]
    console.log(element.selected_tags)

    return (
        <div className={"peak-learning-container"} {...props.attributes} key={0} tabIndex={0}>
            {props.children}
            <PeakLearningSelect nodeId={element.id as number} nodePath={path} selected_tags={(tags) ? tags : []}/>
        </div>
    )
}

const PeakLearningSelect = (props: { nodeId: number, nodePath: number[], selected_tags: PeakTag[] }) => {
    const { nodeId, nodePath, selected_tags } = props
    const dispatch = useDispatch()
    const editor = useEditor()
    const existingTags = useTags()
    const currentUser = useCurrentUser()
    const mainRef = useRef(null);
    const [open, setDropdownState] = useState(false);
    const currentWikiPage = useCurrentWikiPage();
    const [tags, setTags] = useState<PeakDisplayTag[]>(existingTags)
    const [displaySelectedTags, setSelectedTags] = useState<PeakDisplayTag[]>(selected_tags)
    const [currentSearch, setCurrentSearch] = useState<string>("")

    const shouldFocus: boolean = currentWikiPage.editorState.focusMap[nodeId] || false
    if (shouldFocus) {
        console.log(`SHOULD FOCUS: ${shouldFocus}`)
        mainRef.current.focus()
    }
    const onSelect = (displayLabel: LabeledValue) => {
        console.log(`SELECtEd`)
        console.log(displayLabel)
        const existingTag = tags.find(t => t.title === (displayLabel.value))
        if (existingTag) {
            setSelectedTags([...displaySelectedTags, existingTag])
        } else {
            const newColor: string = calculateNextColor(tags)
            const newTag: PeakDisplayTag = {id: STUB_TAG_ID, title: displayLabel.value as string, color: newColor as string}
            setTags([...tags, newTag])
            setSelectedTags([...displaySelectedTags, newTag])
        }
    }
    const onDeselect = (displayLabel: LabeledValue) => {
        const newTagList: PeakDisplayTag[] = displaySelectedTags.filter(tag => tag.title !== displayLabel.value as string)
        // User clicked on the X of the tag, without ever focusing
        if (!shouldFocus) {
            Transforms.setNodes(editor, {selected_tags: newTagList}, { at: nodePath })
        }
        setSelectedTags(newTagList)

    }
    const handleInputKeyDown = (event) => {
        if (event.key === 'Enter' && (!open && currentSearch.length === 0)) {
            console.log("WE WILL BE LEAVING NOW")
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
        reEnterDown(editor, currentWikiPage.id, (n: Node) => n.type === PEAK_LEARNING && n.id === nodeId)
    }
    const leaveUp = () => {
        const [theNode, path] = Editor.nodes(editor, { match: n => n.type === PEAK_LEARNING && n.id === nodeId, at: []});
        const [lastChildNode, wtf] = (theNode[0].children as Node[]).slice(-1)

        if (lastChildNode.type === ELEMENT_CODE_BLOCK) {
            dispatch(setEditorFocusToNode({ pageId: currentWikiPage.id, nodeId: lastChildNode.id as number, focused: true}))
        } else {
            const lastChildNodePath = ReactEditor.findPath(editor, lastChildNode)
            Transforms.select(editor, lastChildNodePath)
            Transforms.collapse(editor, { edge: "end"})
            ReactEditor.focus(editor)
        }
    }
    const lockFocus = (shouldFocus: boolean) => {
        dispatch(setEditorFocusToNode({pageId: currentWikiPage.id, nodeId: nodeId, focused: shouldFocus}))
    }

    const saveAndLeave = () => {
        lockFocus(false)
        setDropdownState(false)

        const hotSwap = (ogList: PeakDisplayTag[], fullList: PeakTag[]) => {
            return ogList.map(tag => (tag.id === STUB_TAG_ID) ? fullList.find(t => t.title === tag.title) as PeakTag : tag)
        }
        createPeakTags(currentUser.id, displaySelectedTags).then(createdTags => {
            const newSelected: PeakDisplayTag[] = hotSwap(displaySelectedTags, createdTags)
            const newTagList: PeakDisplayTag[] = hotSwap(tags, createdTags)
            setTags(newTagList)
            setSelectedTags(newSelected)
            Transforms.setNodes(editor, {selected_tags: newSelected}, { at: nodePath })
        })
    }

    function tagRender(props) {
        const { label, value, closable, onClose } = props;
        console.log(`da props`)
        console.log(props)

        return (
            <Tag color={label} closable={closable} onClose={onClose} style={{ marginRight: 3 }}>
                {value}
            </Tag>
        );
    }

    const CREATE_NEW_TAG_OPTION: PeakDisplayTag = { id: "create-new-tag-item", title: currentSearch, label: `Create new tag: ${currentSearch}` }
    const filteredTags: PeakDisplayTag[] = tags.filter(o => !displaySelectedTags.map(t => t.id).includes(o.id));

    const isEmptyInput: boolean = currentSearch.length === 0
    const isExistingTag: boolean = tags.find(t => t.title === CREATE_NEW_TAG_OPTION.title) !== undefined
    const renderedTagList: PeakDisplayTag[] = (!isEmptyInput && !isExistingTag ) ? [...filteredTags, CREATE_NEW_TAG_OPTION] : filteredTags

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
                onBlur={saveAndLeave}
                open={open}
                onFocus={() => {
                    setDropdownState(true)
                }}
                onInputKeyDown={handleInputKeyDown}
                onSearch={(value) => {
                    setDropdownState(true)
                    setCurrentSearch(value)
                }}
                optionLabelProp="value"
                mode="multiple"
                value={displaySelectedTags.map(t => {
                    return { value: t.title, label: t.color } as LabeledValue
                })}
                labelInValue={true}
                bordered={false}
                placeholder="Tag this information for later"
                onSelect={onSelect}
                onDeselect={onDeselect}
                notFoundContent={<Empty description={"No more tags. Press 'Escape' to exit with arrow keys"}/>}
                tagRender={tagRender}
                style={{ width: '100%' }}>
                {renderedTagList.map(tag => (
                    <Option key={tag.id} value={tag.title as string}>
                        {tag.label || tag.title}
                    </Option>
                ))}
            </Select>
        </div>
    )
}