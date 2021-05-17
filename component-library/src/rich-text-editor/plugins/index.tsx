import {
  createBlockquotePlugin,
  createBoldPlugin,
  createCodeBlockPlugin,
  createCodePlugin,
  createHeadingPlugin,
  createHistoryPlugin,
  createItalicPlugin,
  createLinkPlugin,
  createListPlugin,
  createParagraphPlugin,
  createReactPlugin,
  createStrikethroughPlugin,
  createUnderlinePlugin
} from '@udecode/slate-plugins'
import { createPeakTitlePlugin } from './peak-title-plugin/PeakTitlePlugin'
import { createPeakCalloutPlugin } from './peak-callout-plugin/PeakCalloutPlugin'
import { createDividerPlugin } from './peak-divider/createDividerPlugin'
import { createPeakMediaEmbedPlugin } from './peak-media-embed-plugin/createPeakMediaEmbedPlugin'

export const genericPlugins = [
  // editor
  createReactPlugin(),
  createHistoryPlugin(),

  // elements
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

export const customPlugins = [
  createPeakTitlePlugin(),
  createPeakCalloutPlugin(),
  createDividerPlugin(),
  createPeakMediaEmbedPlugin()
]

export const readOnlyPlugins = [...genericPlugins, ...customPlugins]
