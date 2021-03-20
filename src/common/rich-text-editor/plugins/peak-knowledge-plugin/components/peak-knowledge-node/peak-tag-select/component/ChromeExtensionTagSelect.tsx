import {PeakTag} from "../../../../../../../../types";
import React, {useEffect, useRef, useState, KeyboardEvent} from "react";
import {Select, Tag} from "antd";
import {capitalize_and_truncate} from "../../../../../../../../utils/strings";
import {STUB_TAG_ID, TEMP_HOLDER} from "../../../../../../../../redux/slices/tags/types";
import {LabeledValue} from "antd/es/select";
import {calculateNextColor} from "../utils";
import cn from "classnames";
import {take} from "ramda";
import { updateMessageInPlace } from "../../../../../../../../chrome-extension/content-script/utils/messageUtils";
import {FOCUS_STATE} from "../../../../../../../../chrome-extension/constants/constants";
const { Option } = Select;

/**
 * - Show Tag Icon or not?
 * - optional event handlers inputs
 * @param props
 * @constructor
 */
export const TagSelect = (props: { tabId: number, selected_tags: PeakTag[], existing_tags: PeakTag[], setSelectedTags: (tags: PeakTag[]) => void, forceClose?: boolean }) => {
    const { tabId, selected_tags, setSelectedTags, existing_tags, forceClose } = props
    const mainRef = useRef(null);
    const [open, setDropdownState] = useState(false);
    const [tags, setTags] = useState<PeakTag[]>(existing_tags)
    const [currentSearch, setCurrentSearch] = useState<string>("")
    const [show, setShow] = useState(false)

    function tagRender(props) {
        const { label, value, closable, onClose } = props;

        return (
            <Tag color={label} closable={closable} onClose={onClose} style={{ marginRight: 3 }}>
                {capitalize_and_truncate(value)}
            </Tag>
        );
    }

    useEffect(() => {
        if (forceClose) {
            setDropdownState(false)
        }
    }, [forceClose])

    const CREATE_NEW_TAG_OPTION: PeakTag = { id: TEMP_HOLDER, title: currentSearch.toLowerCase(), label: `Create new tag: ${currentSearch}` }
    const filteredTags: PeakTag[] = take(3, tags.filter(o => !selected_tags.map(t => t.id).includes(o.id)));

    const isEmptyInput: boolean = currentSearch.length === 0
    const isExistingTag: boolean = [...tags, ...selected_tags].find(t => t.title === CREATE_NEW_TAG_OPTION.title) !== undefined
    const renderedTagList: PeakTag[] = (!isEmptyInput && !isExistingTag ) ? [...filteredTags, CREATE_NEW_TAG_OPTION] : filteredTags

    const onSelect = (displayLabel: LabeledValue) => {
        const existingTag = tags.find(t => t.title === (displayLabel.value))
        if (existingTag) {
            setSelectedTags([...selected_tags, existingTag])
        } else {
            const newColor: string = calculateNextColor(tags, selected_tags)
            const newTag: PeakTag = {id: STUB_TAG_ID, title: displayLabel.value as string, color: newColor as string}
            setSelectedTags([...selected_tags, newTag])
        }
    }
    const onDeselect = (displayLabel: LabeledValue) => {
        const newTagList: PeakTag[] = selected_tags.filter(tag => tag.title !== displayLabel.value as string)
        setSelectedTags(newTagList)
        setCurrentSearch("")
    }

    const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        if (open && event.key === "Escape") {
            event.stopPropagation()
            event.preventDefault()
            setCurrentSearch('')
            setDropdownState(false)
        }
        if (open && event.key === 's' && event.metaKey && event.shiftKey) {
            event.stopPropagation()
            event.preventDefault()
            setCurrentSearch('')
            setDropdownState(false)
        }
    }


    // I have no idea why this is necessary for the Notification not to Flash
    useEffect(() => {
        setShow(true)
    }, [])

    // @ts-ignore
    return (
        <div className={"peak-learning-select-container"} data-slate-editor>
            {
                (show) ?
                    <Select
                        onClick={() => {
                            setDropdownState(true)
                            // TODO: lockFocus(true)
                        }}
                        ref={mainRef}
                        open={open}
                        onBlur={() => {
                            setDropdownState(false)
                            updateMessageInPlace(tabId, { focusState: FOCUS_STATE.NotFocused })
                        }}
                        onFocus={() => {
                            setDropdownState(true)
                            updateMessageInPlace(tabId, { focusState: FOCUS_STATE.Focus })
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
                    </Select> :
                    null
            }
        </div>
    )
}
