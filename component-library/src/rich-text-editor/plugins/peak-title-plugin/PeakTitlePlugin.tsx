// eslint-disable-next-line no-unused-vars
import {
  getRenderElement,
  // eslint-disable-next-line no-unused-vars
  SlatePlugin
} from '@udecode/slate-plugins'
import { TITLE } from '../../types'

export const createPeakTitlePlugin = (): SlatePlugin => ({
  pluginKeys: TITLE,
  renderElement: getRenderElement(TITLE)
})
