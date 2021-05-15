import {
  createSlatePluginsComponents,
  ELEMENT_BLOCKQUOTE,
  ELEMENT_LI,
  ELEMENT_UL,
  ELEMENT_OL,
  ELEMENT_CODE_BLOCK
} from '@udecode/slate-plugins'
import {
  PEAK_LI_STYLE,
  PEAK_OL_STYLE,
  PEAK_UL_STYLE,
  PeakBlockquoteElement,
  PeakCodeBlockElement
} from './coreComponentWrappers'

export const useReadOnlyComponents = () => {
  return createSlatePluginsComponents({
    [ELEMENT_BLOCKQUOTE]: PeakBlockquoteElement,
    [ELEMENT_LI]: PEAK_LI_STYLE,
    [ELEMENT_UL]: PEAK_UL_STYLE,
    [ELEMENT_OL]: PEAK_OL_STYLE,
    [ELEMENT_CODE_BLOCK]: PeakCodeBlockElement
  })
}
