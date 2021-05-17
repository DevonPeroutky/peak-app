import {
  createBlockquotePlugin,
  createBoldPlugin,
  createCodeBlockPlugin,
  createCodePlugin,
  createHeadingPlugin,
  createImagePlugin,
  createItalicPlugin,
  createLinkPlugin,
  createListPlugin,
  createParagraphPlugin,
  createStrikethroughPlugin,
  createTodoListPlugin,
  createUnderlinePlugin,
  // eslint-disable-next-line no-unused-vars
  SlatePlugin
} from '@udecode/slate-plugins'
import { createPeakTitlePlugin } from './peak-title-plugin/PeakTitlePlugin'
import { createPeakCalloutPlugin } from './peak-callout-plugin/PeakCalloutPlugin'
import { createDividerPlugin } from './peak-divider/createDividerPlugin'
import { createPeakMediaEmbedPlugin } from './peak-media-embed-plugin/createPeakMediaEmbedPlugin'

export const genericPlugins: SlatePlugin[] = [
  // editor
  // createReactPlugin(),
  // createHistoryPlugin(),
  // createNodeIdPlugin(),

  // elements
  createTodoListPlugin(),
  createImagePlugin(),
  createParagraphPlugin(),
  createBlockquotePlugin(),
  createCodeBlockPlugin(),
  createHeadingPlugin(),
  createListPlugin(),
  createLinkPlugin(),

  // marks
  createBoldPlugin(),
  createItalicPlugin(),
  createUnderlinePlugin(),
  createStrikethroughPlugin(),
  createCodePlugin()
]

export const customPlugins: SlatePlugin[] = [
  createPeakTitlePlugin(),
  createPeakCalloutPlugin(),
  createDividerPlugin(),
  createPeakMediaEmbedPlugin()
]

export const corePlugins: SlatePlugin[] = [...genericPlugins, ...customPlugins]
