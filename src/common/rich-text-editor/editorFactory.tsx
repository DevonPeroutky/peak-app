import React, {useMemo} from "react";
import {usePeakPlugins} from "./base_plugins";
import {defaultOptions} from "./options";
import {
    SlatePlugin,
    SlatePlugins,
} from "@udecode/slate-plugins";
import MemoizedLinkMenu from "./plugins/peak-link-plugin/link-menu/LinkMenu";
import {NodeContentSelect, NodeContentSelectProps} from "./utils/node-content-select/components/NodeContentSelect";
import {TNode} from "@udecode/slate-plugins-core/dist/types/TNode";
import {useActiveEditorState} from "../../redux/slices/activeEditor/activeEditorSlice";
import cn from "classnames"
import "./peak-editor.scss"
import {useComponents} from "./components";

const editorStyle: React.CSSProperties = {
    minHeight: "100%",
    textAlign: "left",
    flex: "1 1 auto",
}
export const defaultEditableProps = {
    // placeholder: 'Enter some rich text…',
    spellCheck: true,
    autoFocus: true,
    style: editorStyle,
};

export interface PeakEditorProps {
    additionalPlugins?: SlatePlugin[],
    onChange: (value: TNode[]) => void
    getNodeContentSelectProps?: () => NodeContentSelectProps
    className?: string
    initialValue: any
    currentPageId: string
}
export const PeakEditor = ({
                               additionalPlugins,
                               currentPageId,
                               className,
                               onChange,
                               initialValue,
                               getNodeContentSelectProps,
                               ...props
}: PeakEditorProps) => {
    const editorState = useActiveEditorState()

    // TODO
    // Why the fuck is this needed
    // useEffect(() => {
    //     sleep(100).then(() => {
    //         Transforms.select(editor, Editor.end(editor, []));
    //         ReactEditor.focus(editor)
    //     })
    // }, [])

    return (
        <div className={cn("peak-rich-text-editor-container", (className) ? className : "")}>
            <SlatePlugins
                id={currentPageId}
                plugins={usePeakPlugins(additionalPlugins)}
                components={useComponents()}
                options={defaultOptions}
                editableProps={defaultEditableProps}
                onChange={onChange}
                initialValue={initialValue}
            >
                <div className="fancy-things-container">
                    <MemoizedLinkMenu
                        key={`${currentPageId}-LinkMenu`}
                        linkState={editorState.currentLinkState}
                        showLinkMenu={editorState.showLinkMenu}
                    />
                    { (getNodeContentSelectProps) ? <NodeContentSelect {...getNodeContentSelectProps()}/> : null }
                </div>
            </SlatePlugins>
        </div>
    )
}
