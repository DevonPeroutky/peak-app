import { ELEMENT_IMAGE } from "@udecode/slate-plugins"

export const ELEMENT_YOUTUBE_EMBED = "youtube_embed"
export const ELEMENT_TWITTER_EMBED = "twitter_embed"
export const ELEMENT_MEDIA_EMBED = "media_embed"
export const ELEMENT_EMBED_STUB = "media_embed_stub"

export type PEAK_MEDIA_EMBED = typeof ELEMENT_TWITTER_EMBED |  typeof ELEMENT_YOUTUBE_EMBED | typeof ELEMENT_MEDIA_EMBED | typeof ELEMENT_IMAGE
export const KEYS_MEDIA_EMBED = [ELEMENT_TWITTER_EMBED, ELEMENT_YOUTUBE_EMBED, ELEMENT_MEDIA_EMBED, ELEMENT_IMAGE, ELEMENT_EMBED_STUB];

