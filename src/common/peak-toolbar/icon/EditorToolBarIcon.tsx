import React, {useState} from "react";
import {message, notification, Tooltip} from "antd";
import "./editor-toolbar-icon.scss"
import {useSlate} from "slate-react";
import cn from "classnames";
import {any} from "ramda";
import {
    ELEMENT_CODE_BLOCK,
    isMarkActive,
    toggleList,
    toggleMark,
    toggleWrapNodes
} from "@udecode/slate-plugins";
import { PeakEditorControlDisplay} from "../toolbar-controls";
import { capitalize } from "lodash";
import {useActiveEditorState} from "../../../redux/slices/activeEditor/activeEditorSlice";
import {isNodeTypeIn} from "../../rich-text-editor/utils/base-utils";

export const EditorToolBarIcon = (props: {
    isDisabled: boolean,
    editorControl: PeakEditorControlDisplay,
    isScrolled: boolean
    className?: string
}) => {
    const { editorControl, isScrolled, className } = props;
    const editor = useSlate();
    const editorState = useActiveEditorState()
    const tooltipContent = <div>{capitalize(editorControl.label)} <span className={"hotkey-command-tag"}>{editorControl.hotkeyInstructionArray.join(" ")}</span></div>;

    const handleClick = () => {

        switch (editorControl.controlType) {
            case "mark":
                toggleMark(editor, editorControl.elementType);
                break;
            case "block":
                toggleWrapNodes(editor, editorControl.elementType);
                break;
            case "list":
                // @ts-ignore
                toggleList(editor, { typeList: editorControl.elementType });
                break;
            case "img":
                notification.open({
                    message: 'Adding an Image',
                    type: "info",
                    description: 'To add an image, simply copy an image or link and paste into the editor!',
                });
                break;
            case ELEMENT_CODE_BLOCK:
                message.info("For now, just use the trashcan to delete the code block!")
                break
            default:
                message.warning("Not implemented yet!");
                break;
        }
    };
    const isActive = () => {
        switch (editorControl.controlType) {
            case "mark":
                return isMarkActive(editor, editorControl.elementType);
            case "block":
            case "list":
                return isNodeTypeIn(editor, editorControl.elementType);
            case ELEMENT_CODE_BLOCK:
                const focusMap = editorState.focusMap
                return (focusMap) ? any((a: boolean) => { return a })(Object.values(editorState.focusMap)) : false;
            default:
                return false;
        }
    };
    const active = isActive();

    return (
        <Tooltip title={tooltipContent} placement={(isScrolled) ? "bottom": "top"}>
            <div
                className={cn("peak-editor-icon", active ? "active" : "", (className) ? className : "")}
                onMouseDown={event => {
                    event.preventDefault()
                }}
                onClick={event => {
                    event.preventDefault();
                    handleClick();
                }}>
                {editorControl.icon}
            </div>
        </Tooltip>
    )
};

EditorToolBarIcon.defaultProps = {
    isDisabled: false,
};