import { Divider, Select} from "antd";
import React, {useState} from "react";
import {EditorToolBarIcon} from "../icon/EditorToolBarIcon";
import "./peak-text-editor-toolbar.scss"
import {
    BASIC_EDITOR_CONTROLS,
    LIST_EDITOR_CONTROLS,
    PeakEditorControl,
    RICH_EDITOR_CONTROLS,
    TEXT_MARKS,
} from "../toolbar-controls";
import {useSlate} from "slate-react";
import cn from "classnames";
import { useScrollPosition } from '@n8tb1t/use-scroll-position';
import {PublishButton} from "../save-button/SaveButton";
import {ELEMENT_PARAGRAPH} from "@udecode/slate-plugins";
import {isNodeTypeIn} from "../../rich-text-editor/utils/base-utils";

const { Option } = Select;

const EditorTextTypeSelect = (props: { }) => {
    const editor = useSlate();
    const activeTextType: PeakEditorControl | undefined = TEXT_MARKS.find(textType => isNodeTypeIn(editor, textType.elementType));

    const onSelect = (value: string) => {
        // toggleHeader(editor, value);
    };

    return (
        <Select
            className="text-type-select"
            onChange={onSelect}
            dropdownMatchSelectWidth={false}
            dropdownClassName="text-type-dropdown"
            optionLabelProp="label"
            value={activeTextType ? activeTextType.elementType : ELEMENT_PARAGRAPH}>
            {
                TEXT_MARKS.map(textType => {
                    // @ts-ignore
                    return (
                        <Option
                            key={textType.elementType}
                            value={textType.elementType}
                            label={textType.label}
                            className={`text-option ${textType.className}`}>
                            <div className={"text-option-container"} onClick={event => event.preventDefault()}>
                                {/*{textType.label} <span className={"header-text-hotkey-command"}>{textType.hotkeyInstruction}</span>*/}
                            </div>
                        </Option>
                    )
                })
            }
        </Select>
    )
};

export const PeakTextEditorToolBar = (props: { isVisible: boolean} ) => {
    const [isScrolled, setScrolled] = useState(false);
    const daClass = props.isVisible ? "rich-editing-bar animated fadeIn" : "rich-editing-bar animated fadeOut";

    useScrollPosition(({ prevPos, currPos }) => {
        (currPos.y < -85)  ? setScrolled(true) : setScrolled(false)
    });

    if (!isScrolled) {
        return (
            <div className={daClass}>
                <div className={"editor-controls"}>
                    <EditorTextTypeSelect/>
                    <Divider type="vertical" className={"rich-editing-bar-divider hide-if-narrow"}/>
                    { BASIC_EDITOR_CONTROLS.map(control => <EditorToolBarIcon key={control.elementType} editorControl={control} isScrolled={isScrolled} className={"hide-if-narrow"}/>)}
                    <Divider type="vertical" className={"rich-editing-bar-divider hide-if-very-narrow"}/>
                    { LIST_EDITOR_CONTROLS.map(control => <EditorToolBarIcon key={control.elementType} editorControl={control} isScrolled={isScrolled} className={"hide-if-very-narrow"}/>)}
                    <Divider type="vertical" className={"rich-editing-bar-divider hide-if-very-narrow"}/>
                    { RICH_EDITOR_CONTROLS.map(control => <EditorToolBarIcon key={control.elementType} isDisabled={true} editorControl={control} isScrolled={isScrolled} className={"hide-if-very-narrow"}/>)}
                </div>
                <PublishButton/>
            </div>
        )
    } else {
        return (
            <div className={cn(daClass, "scrolled")}>
                <div className="bs-container">
                    <div className={"editor-controls"}>
                        <EditorTextTypeSelect/>
                        <Divider type="vertical" className={"rich-editing-bar-divider hide-if-narrow"}/>
                        { BASIC_EDITOR_CONTROLS.map(control => <EditorToolBarIcon key={control.elementType} editorControl={control} isScrolled={isScrolled} className={"hide-if-narrow"}/>)}
                        <Divider type="vertical" className={"rich-editing-bar-divider hide-if-very-narrow"}/>
                        { LIST_EDITOR_CONTROLS.map(control => <EditorToolBarIcon key={control.elementType} editorControl={control} isScrolled={isScrolled} className={"hide-if-very-narrow"}/>)}
                        <Divider type="vertical" className={"rich-editing-bar-divider hide-if-very-narrow"}/>
                        { RICH_EDITOR_CONTROLS.map(control => <EditorToolBarIcon key={control.elementType} isDisabled={true} editorControl={control} isScrolled={isScrolled} className={"hide-if-very-narrow"}/>)}
                    </div>
                    <PublishButton/>
                </div>
            </div>
        )
    }
};
