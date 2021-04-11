import 'tippy.js/dist/tippy.css'
import React, { useMemo } from 'react'
import {
    ELEMENT_H1,
    ELEMENT_IMAGE,
    ELEMENT_PARAGRAPH,
    SlatePlugin,
    SlatePlugins,
    ToolbarSearchHighlight,
    createAlignPlugin,
    createAutoformatPlugin,
    createBlockquotePlugin,
    createBoldPlugin,
    createCodeBlockPlugin,
    createCodePlugin,
    createExitBreakPlugin,
    createHeadingPlugin,
    createHighlightPlugin,
    createHistoryPlugin,
    createKbdPlugin,
    createImagePlugin,
    createItalicPlugin,
    createLinkPlugin,
    createListPlugin,
    createMediaEmbedPlugin,
    createNodeIdPlugin,
    createNormalizeTypesPlugin,
    createParagraphPlugin,
    createReactPlugin,
    createResetNodePlugin,
    createSelectOnBackspacePlugin,
    createSoftBreakPlugin,
    createStrikethroughPlugin,
    createSubscriptPlugin,
    createSuperscriptPlugin,
    createTablePlugin,
    createTodoListPlugin,
    createTrailingBlockPlugin,
    createUnderlinePlugin,
    createDeserializeHTMLPlugin,
    useFindReplacePlugin,
    useMentionPlugin,
} from '@udecode/slate-plugins'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { Search } from '@styled-icons/material/Search'
import {
    initialValueHighlight,
    optionsExitBreakPlugin,
    optionsMentionPlugin,
    optionsResetBlockTypePlugin,
    optionsSoftBreakPlugin,
} from "./playground-utils";
import {defaultEditableProps, usePeakPlugins} from "../../../common/rich-text-editor/editorFactory";
import {optionsAutoformat} from "./playground-autoformat-rules";
import {defaultOptions} from "../../../common/rich-text-editor/options";
import {defaultComponents} from "../../../common/rich-text-editor/components";
import {basePlugins} from "../../../common/rich-text-editor/base_plugins";

const id = 'Examples/Playground'

export const Plugins = () => {
    const { setSearch, plugin: searchHighlightPlugin } = useFindReplacePlugin()
    const { getMentionSelectProps, plugin: mentionPlugin } = useMentionPlugin(
        optionsMentionPlugin
    )

    const plugins: SlatePlugin[] = useMemo(() => {
        const p = [
            createReactPlugin(),
            createHistoryPlugin(),
            createParagraphPlugin(),
            createBlockquotePlugin(),
            createTodoListPlugin(),
            createHeadingPlugin(),
            createImagePlugin(),
            createLinkPlugin(),
            createListPlugin(),
            createTablePlugin(),
            createMediaEmbedPlugin(),
            createCodeBlockPlugin(),
            createAlignPlugin(),
            createBoldPlugin(),
            createCodePlugin(),
            createItalicPlugin(),
            createHighlightPlugin(),
            createUnderlinePlugin(),
            createStrikethroughPlugin(),
            createSubscriptPlugin(),
            createSuperscriptPlugin(),
            createKbdPlugin(),
            createNodeIdPlugin(),
            createAutoformatPlugin(optionsAutoformat),
            createResetNodePlugin(optionsResetBlockTypePlugin),
            createSoftBreakPlugin(optionsSoftBreakPlugin),
            createExitBreakPlugin(optionsExitBreakPlugin),
            createNormalizeTypesPlugin({
                rules: [{ path: [0, 0], strictType: defaultOptions[ELEMENT_H1].type }],
            }),
            createTrailingBlockPlugin({
                type: defaultOptions[ELEMENT_PARAGRAPH].type,
                level: 1,
            }),
            createSelectOnBackspacePlugin({ allow: defaultOptions[ELEMENT_IMAGE].type }),
            mentionPlugin,
            searchHighlightPlugin,
        ]

        p.push(createDeserializeHTMLPlugin({ plugins: p }))

        return p
    }, [mentionPlugin, defaultOptions, searchHighlightPlugin])

    return (
        <DndProvider backend={HTML5Backend}>
            <SlatePlugins
                id={id}
                plugins={usePeakPlugins()}
                components={defaultComponents}
                options={defaultOptions}
                editableProps={defaultEditableProps}
                initialValue={initialValueHighlight}
            >
                <ToolbarSearchHighlight icon={Search} setSearch={setSearch} />
            </SlatePlugins>
        </DndProvider>
    )
}
