import { createSlatePluginsComponents } from '@udecode/slate-plugins'
import { PeakTitleElement } from '../plugins/peak-title-plugin/peak-title/PeakTitle'
import { TITLE } from '../types'
import { PEAK_CALLOUT } from '../plugins/peak-callout-plugin/defaults'
import { PeakCalloutElement } from '../plugins/peak-callout-plugin/component/PeakCallout'
import { DividerElement } from '../plugins/peak-divider/element/DividerElement'
import { ELEMENT_DIVIDER } from '../plugins/peak-divider'

export const useReadOnlyComponents = () => {
  return createSlatePluginsComponents({
    [TITLE]: PeakTitleElement,
    [PEAK_CALLOUT]: PeakCalloutElement,
    [ELEMENT_DIVIDER]: DividerElement
  })
}
