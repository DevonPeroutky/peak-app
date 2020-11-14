import React, { useState, ReactNode } from 'react';
import {QuestionCircleFilled} from "@ant-design/icons/lib";
import {Modal} from "antd";
import "./help-modal.scss"
import {KEYBOARD_SHORTCUTS, MARKDOWN_SHORTCUTS} from "../../peak-toolbar/toolbar-controls";

export const HelpModal = (props: {}) => {
    const [isVisible, setVisible] = useState(false)
    return (
        <>
            <QuestionCircleFilled onClick={() => setVisible(true)} className={"help-modal-icon"}/>
            <Modal
                className={"help-modal"}
                visible={isVisible}
                title={<h3>Editor help</h3>}
                onCancel={() => setVisible(false)}
                footer={[
                    <div>Use <span className="hotkey-button-tag">/</span> a new line to search through the available node types.</div>
                ]}
            >
                <div className="help-modal-content">
                    <div className={"help-modal-column"}>
                        <h4>Keyboard Shortcuts</h4>
                        {KEYBOARD_SHORTCUTS.map(k => <ShortcutHelp key={k.label} label={k.label} hotkeyInstructionArray={k.hotkeyInstructionArray}/>)}
                    </div>
                    <div className={"help-modal-column"}>
                        <h4>Markdown Shortcuts</h4>
                        {MARKDOWN_SHORTCUTS.map(k => <MarkdownHelp key={`${k.label}-md`} label={k.label} markupLabel={k.markupLabel}/>)}
                    </div>
                </div>
            </Modal>
        </>
    )
}

const ShortcutHelp = (props: {label: string, hotkeyInstructionArray: string[]}) => {
    const { label, hotkeyInstructionArray } = props
    return (
        <div className="hotkey-instruction-row" key={`${label}-${hotkeyInstructionArray.join(",")}`}>
            <span>{label}</span>
            <div key={`${label}-${hotkeyInstructionArray.join(" ")}`}>
                {hotkeyInstructionArray
                    .map<ReactNode>(hotkey => <span className={"hotkey-button-tag"} key={`${label}-${hotkey}`}>{hotkey}</span>)
                    .reduce((prev, curr) => [prev, ' + ', curr])}
            </div>
        </div>
    )
}

const MarkdownHelp = (props: {label: string, markupLabel: string[]}) => {
    const { label, markupLabel } = props

    return (
        <div className="hotkey-instruction-row" key={`${label}-${markupLabel.join(",")}`}>
            <span>{label}</span>
            <div key={`${label}-${markupLabel.join(" ")}`}>
                {markupLabel
                    .map<ReactNode>(hotkey => <span className={"hotkey-button-tag"} key={`${label}-${hotkey}`}>{hotkey}</span>)
                    .reduce((prev, curr) => [prev, ' ', curr])}

            </div>
        </div>
    )
}
