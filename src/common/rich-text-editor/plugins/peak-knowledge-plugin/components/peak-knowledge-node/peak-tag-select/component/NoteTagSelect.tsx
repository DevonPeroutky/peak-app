import {PeakTag} from "../../../../../../../../types";
import React, {useRef, useState} from "react";
import {Select, Tag} from "antd";
import {capitalize_and_truncate} from "../../../../../../../../utils/strings";
import {STUB_TAG_ID, TEMP_HOLDER} from "../../../../../../../../redux/slices/tags/types";
import {LabeledValue} from "antd/es/select";
import {calculateNextColor} from "../utils";
import cn from "classnames";
import {createPeakTags, useTags} from "../../../../../../../../client/tags";
import {useCurrentUser} from "../../../../../../../../utils/hooks";
import {updatePeakNote} from "../../../../../../../../client/notes";
import "./peak-tag-select.scss"
import {STUB_BOOK_ID} from "../../../../../../../../redux/slices/noteSlice";
const { Option } = Select;

/**
 * - Show Tag Icon or not?
 * - optional event handlers inputs
 * @param props
 * @constructor
 */
export const NoteTagSelect = (props: { selected_tags: PeakTag[], note_id: string }) => {
    const { selected_tags, note_id } = props
    const existingTags = useTags()
    const currentUser = useCurrentUser()
    const [tags, setTags] = useState<PeakTag[]>(existingTags)
    const [displaySelectedTags, setSelectedTags] = useState<PeakTag[]>(selected_tags)

    const mainRef = useRef(null);
    const [open, setDropdownState] = useState(false);
    const [currentSearch, setCurrentSearch] = useState<string>("")

    function tagRender(props) {
        const { label, value, closable, onClose } = props;

        return (
            <Tag color={label} closable={closable} onClose={onClose} style={{ marginRight: 3 }}>
                {capitalize_and_truncate(value)}
            </Tag>
        );
    }

    const CREATE_NEW_TAG_OPTION: PeakTag = { id: TEMP_HOLDER, title: currentSearch.toLowerCase(), label: `Create new tag: ${currentSearch}` }
    const filteredTags: PeakTag[] = tags.filter(o => !displaySelectedTags.map(t => t.id).includes(o.id));

    const isEmptyInput: boolean = currentSearch.length === 0
    const isExistingTag: boolean = [...tags, ...displaySelectedTags].find(t => t.title === CREATE_NEW_TAG_OPTION.title) !== undefined
    const renderedTagList: PeakTag[] = (!isEmptyInput && !isExistingTag ) ? [...filteredTags, CREATE_NEW_TAG_OPTION] : filteredTags

    const saveAndLeave = () => {
        setDropdownState(false)
        const hotSwap = (ogList: PeakTag[], fullList: PeakTag[]) => {
            return ogList.map(tag => (tag.id === STUB_TAG_ID) ? fullList.find(t => t.title === tag.title) as PeakTag : tag)
        }
        createPeakTags(currentUser.id, displaySelectedTags).then(createdTags => {
            const newSelected: PeakTag[] = hotSwap(displaySelectedTags, createdTags)
            setTags([...tags, ...createdTags])
            setSelectedTags(newSelected)
            updatePeakNote(currentUser.id, note_id, { tag_ids: newSelected.map(t => t.id) })
        }).finally(() => {
            setCurrentSearch("")
        })
    }

    const onSelect = (displayLabel: LabeledValue) => {
        const existingTag = tags.find(t => t.title === (displayLabel.value))
        if (existingTag) {
            setSelectedTags([...displaySelectedTags, existingTag])
        } else {
            const newColor: string = calculateNextColor(tags, displaySelectedTags)
            const newTag: PeakTag = {id: STUB_TAG_ID, title: displayLabel.value as string, color: newColor as string}
            setSelectedTags([...displaySelectedTags, newTag])
        }
    }
    const onDeselect = (displayLabel: LabeledValue) => {
        const newTagList: PeakTag[] = displaySelectedTags.filter(tag => tag.title !== displayLabel.value as string)
        setSelectedTags(newTagList)
        setCurrentSearch("")
    }

    const onKeyDown = (event) => {
        if (open && event.key === "Escape") {
            event.stopPropagation()
            event.preventDefault()
            console.log(`CLOSING THE SHOP`)
            setCurrentSearch('')
            setDropdownState(false)
        }
    }

    console.log(`SELECTED TAGS `, displaySelectedTags)
    console.log(`TAGS `, tags)

    // @ts-ignore
    return (
        <div className={"peak-learning-select-container note"} data-slate-editor>
            <Select
                onClick={() => {
                    setDropdownState(true)
                    // TODO: lockFocus(true)
                }}
                ref={mainRef}
                disabled={note_id === STUB_BOOK_ID}
                open={open}
                onBlur={saveAndLeave}
                onFocus={() => {
                    setDropdownState(true)
                }}
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
                onInputKeyDown={onKeyDown}
                placeholder="Add tags"
                onSelect={onSelect}
                dropdownClassName={cn("peak-tag-select-dropdown", (open) ? "" : "closed")}
                onDeselect={onDeselect}
                notFoundContent={<span>No more tags.</span>}
                tagRender={tagRender}
                style={{ width: '100%' }}>
                {renderedTagList.map(tag => (
                    <Option key={tag.id} value={tag.title as string}>
                        <div className={"peak-learning-select-option"}>
                            <span>{capitalize_and_truncate(tag.label || tag.title, 50)}</span>
                        </div>
                    </Option>
                ))}
            </Select>
        </div>
    )
}
