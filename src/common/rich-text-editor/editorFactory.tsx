import React, {useMemo} from "react";
import {usePeakPlugins} from "./plugins";
import {defaultOptions} from "./options";
import {
    Options, PlaceholderProps,
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
import {DEFAULT_PLACEHOLDERS} from "./constants";
import {contains, includes} from "ramda";

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
    enableDnD?: boolean
    placeholderOverrides?: Options<PlaceholderProps>[]
    currentPageId: string
}
export const PeakEditor = ({
                               additionalPlugins,
                               currentPageId,
                               className,
                               onChange,
                               initialValue,
                               placeholderOverrides,
                               enableDnD,
                               getNodeContentSelectProps,
                               ...props
}: PeakEditorProps) => {
    const editorState = useActiveEditorState()
    const dragAndDrop: boolean = (enableDnD === undefined) ? true : enableDnD
    const nodePlaceholders: Options<PlaceholderProps>[] = (placeholderOverrides) ? [...DEFAULT_PLACEHOLDERS.filter(p => !includes(p.key, placeholderOverrides.map(po => po.key))), ...placeholderOverrides] : DEFAULT_PLACEHOLDERS

    // TODO
    // Why the fuck is this needed
    // useEffect(() => {
    //     sleep(100).then(() => {
    //         Transforms.select(editor, Editor.end(editor, []));
    //         ReactEditor.focus(editor)
    //     })
    // }, [])

    console.log(`THE PLACEHOLDERS `, nodePlaceholders)
    return (
        <div className={cn("peak-rich-text-editor-container", (className) ? className : "")}>
            <SlatePlugins
                id={currentPageId}
                plugins={usePeakPlugins(additionalPlugins)}
                components={useComponents(dragAndDrop, nodePlaceholders)}
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
