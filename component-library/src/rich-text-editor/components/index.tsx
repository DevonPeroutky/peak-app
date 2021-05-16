import { createSlatePluginsComponents } from '@udecode/slate-plugins'
import { PeakTitleElement } from '../plugins/peak-title-plugin/peak-title/PeakTitle'
import { TITLE } from '../types'
import { PEAK_CALLOUT } from '../plugins/peak-callout-plugin/defaults'
import { PeakCalloutElement } from '../plugins/peak-callout-plugin/component/PeakCallout'

export const useReadOnlyComponents = () => {
  return createSlatePluginsComponents({
    [TITLE]: PeakTitleElement,
    [PEAK_CALLOUT]: PeakCalloutElement
  })
}
