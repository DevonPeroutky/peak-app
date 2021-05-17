import {
  createBlockquotePlugin,
  createBoldPlugin,
  createCodeBlockPlugin,
  createCodePlugin,
  createHeadingPlugin,
  createImagePlugin,
  createItalicPlugin,
  createLinkPlugin,
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

export const basePlugins: SlatePlugin[] = [...genericPlugins, ...customPlugins]
export * from './peak-callout-plugin/defaults'
export * from './peak-divider/defaults'
export * from './peak-media-embed-plugin/types'
