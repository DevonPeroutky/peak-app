import {PeakTag} from "../../../../../../../../types";
import React, {useRef, useState} from "react";
import {Select, Tag} from "antd";
import {capitalize_and_truncate} from "../../../../../../../../utils/strings";
import {STUB_TAG_ID, TEMP_HOLDER} from "../../../../../../../../redux/slices/tags/types";
import {LabeledValue} from "antd/es/select";
import {calculateNextColor} from "../utils";
import cn from "classnames";
const { Option } = Select;

/**
 * - Show Tag Icon or not?
 * - optional event handlers inputs
 * @param props
 * @constructor
 */
export const TagSelect = (props: { selected_tags: PeakTag[], existing_tags: PeakTag[], setSelectedTags: (tags: PeakTag[]) => void }) => {
    const { selected_tags, setSelectedTags, existing_tags } = props
    const mainRef = useRef(null);
    const [open, setDropdownState] = useState(false);
    const [tags, setTags] = useState<PeakTag[]>(existing_tags)
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
    const filteredTags: PeakTag[] = tags.filter(o => !selected_tags.map(t => t.id).includes(o.id));

    const isEmptyInput: boolean = currentSearch.length === 0
    const isExistingTag: boolean = [...tags, ...selected_tags].find(t => t.title === CREATE_NEW_TAG_OPTION.title) !== undefined
    const renderedTagList: PeakTag[] = (!isEmptyInput && !isExistingTag ) ? [...filteredTags, CREATE_NEW_TAG_OPTION] : filteredTags

    const onSelect = (displayLabel: LabeledValue) => {
        const existingTag = tags.find(t => t.title === (displayLabel.value))
        if (existingTag) {
            setSelectedTags([...selected_tags, existingTag])
        } else {
            const newColor: string = calculateNextColor(tags)
            const newTag: PeakTag = {id: STUB_TAG_ID, title: displayLabel.value as string, color: newColor as string}
            setSelectedTags([...selected_tags, newTag])
        }
    }
    const onDeselect = (displayLabel: LabeledValue) => {
        const newTagList: PeakTag[] = selected_tags.filter(tag => tag.title !== displayLabel.value as string)
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

    // @ts-ignore
    return (
        <div className={"peak-learning-select-container"} data-slate-editor>
            <Select
                onClick={() => {
                    setDropdownState(true)
                    // TODO: lockFocus(true)
                }}
                ref={mainRef}
                open={open}
                onBlur={() => {
                    setDropdownState(false)
                }}
                onFocus={() => {
                    setDropdownState(true)
                }}
                onSearch={(value) => {
                    setDropdownState(true)
                    setCurrentSearch(value)
                }}
                optionLabelProp="value"
                mode="multiple"
                value={selected_tags.map(t => {
                    return { value: t.title, label: t.color } as LabeledValue
                })}
                labelInValue={true}
                bordered={false}
                onInputKeyDown={onKeyDown}
                placeholder="Tab to start selecting tags"
                onSelect={onSelect}
                dropdownClassName={cn("peak-tag-select-dropdown", (open) ? "" : "closed")}
                onDeselect={onDeselect}
                // notFoundContent={<Empty description={"No more tags. Press 'Escape' to exit with arrow keys"}/>}
                notFoundContent={<span>No more tags. Press 'Escape' to exit with arrow keys</span>}
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
