import React, {useState} from "react";
import {message, notification, Tooltip} from "antd";
import "./editor-toolbar-icon.scss"
import {useSlate} from "slate-react";
import cn from "classnames";
import {any} from "ramda";
import {
    ELEMENT_CODE_BLOCK,
    isMarkActive,
    isNodeTypeIn,
    toggleList,
    toggleMark,
    toggleWrapNodes
} from "@udecode/slate-plugins";
import { PeakEditorControlDisplay} from "../toolbar-controls";
import { capitalize } from "lodash";
import {PeakWikiPage} from "../../../redux/wikiPageSlice";
import {useCurrentWikiPage} from "../../../utils/hooks";

export const EditorToolBarIcon = (props: {
    isDisabled: boolean,
    editorControl: PeakEditorControlDisplay,
    isScrolled: boolean
    className?: string
}) => {
    const { editorControl, isScrolled, className } = props;
    const editor = useSlate();
    const currentPage: PeakWikiPage = useCurrentWikiPage()
    const tooltipContent = <div>{capitalize(editorControl.label)} <span className={"hotkey-command-tag"}>{editorControl.hotkeyInstruction}</span></div>;

    const handleClick = () => {

        switch (editorControl.controlType) {
            case "mark":
                toggleMark(editor, editorControl.elementType);
                break;
            case "block":
                toggleWrapNodes(editor, editorControl.elementType);
                break;
            case "list":
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
                const codeFocusMap = currentPage.editorState.codeFocusMap
                return (codeFocusMap) ? any((a: boolean) => { return a })(Object.values(currentPage.editorState.codeFocusMap)) : false;
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