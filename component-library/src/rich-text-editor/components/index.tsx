import { createSlatePluginsComponents } from '@udecode/slate-plugins'
import { PeakTitleElement } from '../plugins/peak-title-plugin/peak-title/PeakTitle'
import { TITLE } from '../types'

export const useReadOnlyComponents = () => {
  return createSlatePluginsComponents({
    [TITLE]: PeakTitleElement
  })
}
