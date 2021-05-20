import {
  getRenderElement,
  // eslint-disable-next-line no-unused-vars
  SlatePlugin
} from '@udecode/slate-plugins'
import { KEYS_MEDIA_EMBED } from './types'

export const createPeakMediaEmbedPlugin = (): SlatePlugin => ({
  pluginKeys: KEYS_MEDIA_EMBED,
  renderElement: getRenderElement(KEYS_MEDIA_EMBED)
})
