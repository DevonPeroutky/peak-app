// eslint-disable-next-line no-unused-vars
import { getRenderElement, SlatePlugin } from '@udecode/slate-plugins'
import { ELEMENT_DIVIDER } from './defaults'

export const createDividerPlugin = (): SlatePlugin => ({
  pluginKeys: ELEMENT_DIVIDER,
  renderElement: getRenderElement(ELEMENT_DIVIDER)
})
