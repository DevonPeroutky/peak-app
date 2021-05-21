import { createSlatePluginsComponents } from '@udecode/slate-plugins'
import { PeakTitleElement } from '../plugins/peak-title-plugin/peak-title'
import { PEAK_CALLOUT, ELEMENT_TITLE } from '../plugins'
import { PeakCalloutElement } from '../plugins/peak-callout-plugin/component'
import { DividerElement } from '../plugins/peak-divider/element'
import { ELEMENT_DIVIDER } from '../plugins/peak-divider'
import {
  RichLinkEmbed,
  TwitterEmbed,
  YoutubeEmbed
} from '../plugins/peak-media-embed-plugin/components'
import {
  ELEMENT_MEDIA_EMBED,
  ELEMENT_TWITTER_EMBED,
  ELEMENT_YOUTUBE_EMBED
} from '../plugins/peak-media-embed-plugin'
import "./component-styling.scss"

export const PEAK_SLATE_COMPONENT_OVERRIDES = {
  [ELEMENT_TITLE]: PeakTitleElement,
  [PEAK_CALLOUT]: PeakCalloutElement,
  [ELEMENT_DIVIDER]: DividerElement,
  [ELEMENT_TWITTER_EMBED]: TwitterEmbed,
  [ELEMENT_YOUTUBE_EMBED]: YoutubeEmbed,
  [ELEMENT_MEDIA_EMBED]: RichLinkEmbed
}

export const useReadOnlyComponents = () => {
  return createSlatePluginsComponents(PEAK_SLATE_COMPONENT_OVERRIDES)
}
