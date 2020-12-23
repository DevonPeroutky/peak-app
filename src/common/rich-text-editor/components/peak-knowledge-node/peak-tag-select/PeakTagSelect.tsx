import {PeakTag, STUB_TAG_ID, TEMP_HOLDER} from "../../../../../redux/slices/tagSlice";
import {useDispatch} from "react-redux";
import {ReactEditor, useEditor} from "slate-react";
import {createPeakTags, deletePeakTag, useTags} from "../../../../../utils/requests";
import {useCurrentUser, useCurrentWikiPage} from "../../../../../utils/hooks";
import React, {useRef, useState} from "react";
import {LabeledValue} from "antd/es/select";
import {calculateNextColor} from "../../../plugins/peak-learning-plugin/utils";
import {Editor, Node, Transforms} from "slate";
import {forceFocusToNode, reEnterDown} from "../../../utils/external-editor-utils";
import {PEAK_LEARNING} from "../../../plugins/peak-learning-plugin/defaults";
import {ELEMENT_CODE_BLOCK} from "@udecode/slate-plugins";
import {setEditorFocusToNode} from "../../../../../redux/slices/wikiPageSlice";
import {Empty, Select, Tag} from "antd";
import {capitalize_and_truncate} from "../../../../../utils/strings";
import {DeleteOutlined, TagOutlined} from "@ant-design/icons/lib";
import "./peak-tag-select.scss"
const { Option } = Select;

export interface PeakDisplayTag {
    id: string
    title: string
    color?: string
    label?: string
}

export const PeakTagSelect = (props: { nodeId: number, nodePath: number[], selected_tags: PeakTag[] }) => {
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
        mainRef.current.focus()
    }
    const onSelect = (displayLabel: LabeledValue) => {
        const existingTag = tags.find(t => t.title === (displayLabel.value))
        if (existingTag) {
            setSelectedTags([...displaySelectedTags, existingTag])
        } else {
            const newColor: string = calculateNextColor(tags)
            const newTag: PeakDisplayTag = {id: STUB_TAG_ID, title: displayLabel.value as string, color: newColor as string}
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
        setCurrentSearch("")
    }
    const handleInputKeyDown = (event) => {
        if (event.key === 'Enter' && (!open && currentSearch.length === 0)) {
            event.preventDefault()
            leaveDown()
        } else if (event.key === "Escape") {
            setDropdownState(false)
            mainRef.current.focus()
        } else if (["ArrowDown", "ArrowUp"].includes(event.key) && !open) {
            (event.key === "ArrowDown") ? leaveDown() : leaveUp()
        }
    }
    const deleteTag = (displayTag: PeakDisplayTag) => {
        deletePeakTag(currentUser.id, displayTag.id).then(res => {
            const newTagList: PeakDisplayTag[] = tags.filter(t => t.id !== res)
            setTags(newTagList)
        })
    }

    const leaveDown = () => {
        reEnterDown(editor, (n: Node) => n.type === PEAK_LEARNING && n.id === nodeId)
    }

    // TODO: Why can't this be re-enter up?
    const leaveUp = () => {
        const [theNode, path] = Editor.nodes(editor, { match: n => n.type === PEAK_LEARNING && n.id === nodeId, at: []});
        const [lastChildNode, wtf] = (theNode[0].children as Node[]).slice(-1)

        if (lastChildNode.type === ELEMENT_CODE_BLOCK) {
            forceFocusToNode(lastChildNode)
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
            setTags([...tags, ...createdTags])
            setSelectedTags(newSelected)
            Transforms.setNodes(editor, {selected_tags: newSelected}, { at: nodePath })
        }).finally(() => {
            setCurrentSearch("")
        })
    }

    function tagRender(props) {
        const { label, value, closable, onClose } = props;

        return (
            <Tag color={label} closable={closable} onClose={onClose} style={{ marginRight: 3 }}>
                {capitalize_and_truncate(value)}
            </Tag>
        );
    }

    const CREATE_NEW_TAG_OPTION: PeakDisplayTag = { id: TEMP_HOLDER, title: currentSearch.toLowerCase(), label: `Create new tag: ${currentSearch}` }
    const filteredTags: PeakDisplayTag[] = tags.filter(o => !displaySelectedTags.map(t => t.id).includes(o.id));

    const isEmptyInput: boolean = currentSearch.length === 0
    const isExistingTag: boolean = [...tags, ...displaySelectedTags].find(t => t.title === CREATE_NEW_TAG_OPTION.title) !== undefined
    const renderedTagList: PeakDisplayTag[] = (!isEmptyInput && !isExistingTag ) ? [...filteredTags, CREATE_NEW_TAG_OPTION] : filteredTags

    return (
        <div className={"peak-learning-select-container"} data-slate-editor>
            <TagOutlined className={"peak-tag-icon"}/>
            <Select
                onClick={() => {
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
                        <div className={"peak-learning-select-option"}>
                            <span>{capitalize_and_truncate(tag.label || tag.title, 50)}</span>
                            { (tag.id === TEMP_HOLDER) ?
                                null :
                                <DeleteOutlined className={"peak-delete-learning-option"} onClick={(e) => {
                                    e.stopPropagation()
                                    deleteTag(tag)
                                }}/>
                            }

                        </div>
                    </Option>
                ))}
            </Select>
        </div>
    )
}
