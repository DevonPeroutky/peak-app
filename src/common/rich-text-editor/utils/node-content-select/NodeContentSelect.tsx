import * as React from 'react';
import { useEffect, useRef } from 'react';
import {classNamesFunction, IStyleFunctionOrObject, styled} from '@uifabric/utilities';
import { ReactEditor, useSlate } from 'slate-react';
import {
    getMentionSelectStyles,
    getPreventDefaultHandler,
    MentionSelectStyleProps,
    MentionSelectStyles,
    PortalBody
} from "@udecode/slate-plugins";
import {Range} from "slate";
import {PeakEditorControlDisplay} from "../../../peak-toolbar/toolbar-controls";
import {Tag} from "antd";
import {trim} from "lodash";
import "./node-content-select.scss"

export interface NodeContentSelectProps {
    /**
     * Additional class name to provide on the root element.
     */
    className?: string;
    /**
     * Call to provide customized styling that will layer on top of the variant rules.
     */
    styles?: IStyleFunctionOrObject<MentionSelectStyleProps, MentionSelectStyles>;
    /**
     * Range from the mention trigger to the cursor
     */
    at: Range | null;
    /**
     * List of mentionable items
     */
    options: PeakEditorControlDisplay[];
    /**
     * Index of the selected option
     */
    valueIndex: number;
    /**
     * Callback called when clicking on a mention option
     */
    onClickMention?: (editor: ReactEditor, option: PeakEditorControlDisplay) => void;
}

const getClassNames = classNamesFunction<
    MentionSelectStyleProps,
    MentionSelectStyles
    >();

const NodeContentSelectBase = ({
                                      className,
                                      styles,
                                      at,
                                      options,
                                      valueIndex,
                                      onClickMention,
                                      ...props
                                  }: NodeContentSelectProps) => {
    const classNames = getClassNames(styles, {
        className,
    });

    const ref: any = useRef();
    const editor = useSlate();

    useEffect(() => {
        if (at && options.length > 0) {
            const el = ref.current;
            const domRange = ReactEditor.toDOMRange(editor, at);
            const rect = domRange.getBoundingClientRect();
            if (el) {
                el.style.top = `${rect.top + window.pageYOffset + 24}px`;
                el.style.left = `${rect.left + window.pageXOffset}px`;
            }
        }
    }, [options.length, editor, at]);

    if (!at || !options.length) {
        return null;
    }

    return (
        <PortalBody>
            <div ref={ref} className={classNames.root} {...props}>
                {options.map((option, i) => (
                    <div
                        key={`${i}${option.label}`}
                        className={
                            i === valueIndex
                                ? `${classNames.mentionItemSelected} peak-node-content-item-selected`
                                : classNames.mentionItem
                        }
                        onMouseDown={getPreventDefaultHandler(
                            onClickMention,
                            editor,
                            option
                        )}
                    >
                        <div className={"node-content-select-item-container"}>
                            {option.icon}
                            <div className={"node-content-item"}>
                                <div className={"node-content-item-body"}>
                                    <div className={"node-title"}>{option.label}</div>
                                    <div className={"node-description"}>{option.description}</div>
                                </div>
                                {(option.hotkeyInstructionArray) ? <Tag className={"node-hotkey"}>{trim(option.hotkeyInstructionArray.join(""), '()')}</Tag> : null}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </PortalBody>
    );
};

export const NodeContentSelect = styled<
    NodeContentSelectProps,
    MentionSelectStyleProps,
    MentionSelectStyles
    >(NodeContentSelectBase, getMentionSelectStyles, undefined, {
    scope: 'MentionSelect',
});