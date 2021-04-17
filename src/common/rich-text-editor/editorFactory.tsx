import React, {useMemo} from "react";
import {basePlugins, peakPlugins} from "./base_plugins";
import {defaultOptions} from "./options";
import {
    createDeserializeHTMLPlugin,
    SlatePlugin,
    SlatePlugins,
} from "@udecode/slate-plugins";
import {defaultComponents} from "./components";
import MemoizedLinkMenu from "./plugins/peak-link-plugin/link-menu/LinkMenu";
import {NodeContentSelect, NodeContentSelectProps} from "./utils/node-content-select/components/NodeContentSelect";
import {TNode} from "@udecode/slate-plugins-core/dist/types/TNode";
import {useActiveEditorState} from "../../redux/slices/activeEditor/activeEditorSlice";
import cn from "classnames"
import "./peak-editor.scss"

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

export const usePeakPlugins = (additionalPlugins?: SlatePlugin[]) => {
    return useMemo(() => {
        const plugins = (additionalPlugins) ? [...peakPlugins, ...additionalPlugins] : peakPlugins
        plugins.push(createDeserializeHTMLPlugin({ plugins }));

        return plugins
    }, [additionalPlugins, defaultOptions])
}

export const useBasicPlugins = (additionalPlugins?: SlatePlugin[]) => {
    return useMemo(() => {
        const plugins = (additionalPlugins) ? [...basePlugins, ...additionalPlugins] : basePlugins
        plugins.push(createDeserializeHTMLPlugin({ plugins }));

        return plugins
    }, [additionalPlugins, defaultOptions])
}

export interface PeakEditorProps {
    additionalPlugins?: SlatePlugin[],
    onChange: (value: TNode[]) => void
    getNodeContentSelectProps?: () => NodeContentSelectProps
    className?: string
    initialValue: any
    currentPageId: string
}
export const PeakEditor = ({ additionalPlugins, currentPageId, className, onChange, initialValue, getNodeContentSelectProps, ...props}: PeakEditorProps) => {
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
                components={defaultComponents}
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

export const PeakExtensionEditor = ({ additionalPlugins, currentPageId, className, onChange, initialValue, getNodeContentSelectProps, ...props}: PeakEditorProps) => {
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
                components={defaultComponents}
                options={defaultOptions}
                editableProps={defaultEditableProps}
                onChange={onChange}
                initialValue={initialValue}
            />
        </div>
    )
}