// eslint-disable-next-line no-unused-vars
import {
  getRenderElement,
  // eslint-disable-next-line no-unused-vars
  SlatePlugin
} from '@udecode/slate-plugins'
import { ELEMENT_TITLE } from './types'

export const createPeakTitlePlugin = (): SlatePlugin => ({
  pluginKeys: ELEMENT_TITLE,
  renderElement: getRenderElement(ELEMENT_TITLE)
})
