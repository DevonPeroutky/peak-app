import {
  createBlockquotePlugin,
  createBoldPlugin,
  createCodeBlockPlugin,
  createCodePlugin,
  createHeadingPlugin,
  createHistoryPlugin,
  createItalicPlugin,
  createListPlugin,
  createParagraphPlugin,
  createReactPlugin,
  createStrikethroughPlugin,
  createUnderlinePlugin
} from '@udecode/slate-plugins'
import { createPeakTitlePlugin } from './peak-title-plugin/PeakTitlePlugin'
import {createPeakCalloutPlugin} from "./peak-callout-plugin/PeakCalloutPlugin";

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

  // marks
  createBoldPlugin(),
  createItalicPlugin(),
  createUnderlinePlugin(),
  createStrikethroughPlugin(),
  createCodePlugin()
]

export const customPlugins = [
  createPeakTitlePlugin(),
  createPeakCalloutPlugin()
]

export const readOnlyPlugins = [...genericPlugins, ...customPlugins]
