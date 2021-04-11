import 'tippy.js/dist/tippy.css'
import ReactDOM from 'react-dom'
import React, { useMemo } from 'react'
import {
    ELEMENT_H1,
    ELEMENT_IMAGE,
    ELEMENT_PARAGRAPH,
    createSlatePluginsComponents,
    createSlatePluginsOptions,
    HeadingToolbar,
    MentionSelect,
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
    withProps,
    MentionElement,
    ELEMENT_MENTION,
} from '@udecode/slate-plugins'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { Search } from '@styled-icons/material/Search'
import {
    initialValueHighlight,
    optionsExitBreakPlugin,
    optionsMentionPlugin, optionsResetBlockTypePlugin, optionsSoftBreakPlugin,
    renderMentionLabel,
    withStyledDraggables,
    withStyledPlaceHolders
} from "./playground-utils";
import {defaultEditableProps} from "../../common/rich-text-editor/editorFactory";
import {optionsAutoformat} from "./playground-autoformat-rules";

const id = 'Examples/Playground'

let components = createSlatePluginsComponents({
    [ELEMENT_MENTION]: withProps(MentionElement, {
        renderLabel: renderMentionLabel,
    }),
    // customize your components by plugin key
})
components = withStyledPlaceHolders(components)
components = withStyledDraggables(components)

const options = createSlatePluginsOptions({
    // customize your options by plugin key
})

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
                rules: [{ path: [0, 0], strictType: options[ELEMENT_H1].type }],
            }),
            createTrailingBlockPlugin({
                type: options[ELEMENT_PARAGRAPH].type,
                level: 1,
            }),
            createSelectOnBackspacePlugin({ allow: options[ELEMENT_IMAGE].type }),
            mentionPlugin,
            searchHighlightPlugin,
        ]

        p.push(createDeserializeHTMLPlugin({ plugins: p }))

        return p
    }, [mentionPlugin, searchHighlightPlugin])

    console.log(`PLUGINS `, plugins)

    return (
        <DndProvider backend={HTML5Backend}>
            <SlatePlugins
                id={id}
                plugins={plugins}
                components={components}
                options={options}
                editableProps={defaultEditableProps}
                initialValue={initialValueHighlight}
            >
                <ToolbarSearchHighlight icon={Search} setSearch={setSearch} />
                <MentionSelect
                    {...getMentionSelectProps()}
                    renderLabel={renderMentionLabel}
                />
            </SlatePlugins>
        </DndProvider>
    )
}
