import {
    DEFAULTS_ALIGN,
    DEFAULTS_BLOCKQUOTE, DEFAULTS_BOLD, DEFAULTS_CODE, DEFAULTS_CODE_BLOCK,
    DEFAULTS_IMAGE, DEFAULTS_ITALIC, DEFAULTS_LIST, DEFAULTS_MEDIA_EMBED,
    DEFAULTS_MENTION,
    DEFAULTS_PARAGRAPH, DEFAULTS_STRIKETHROUGH, DEFAULTS_SUBSUPSCRIPT, DEFAULTS_UNDERLINE,
    setDefaults
} from "@udecode/slate-plugins";
import {
    PEAK_BLOCKQUOTE_OVERRIDES,
    PEAK_CODE_BLOCK_OVERRIDES,
    PEAK_LIST_SPECIFIC_STYLE,
    PEAK_STRIKETHROUGH_OVERRIDES
} from "./plugin-overrides";
import {DEFAULTS_PEAK_HEADING} from "./plugins/peak-heading-plugin/defaults";
import {DEFAULTS_PEAK_CODE_BLOCK} from "./plugins/peak-code-plugin/defaults";
import {DEFAULTS_CALLOUT} from "./plugins/peak-callout-plugin/defaults";
import {DEFAULTS_PEAK_KNOWLEDGE} from "./plugins/peak-knowledge-plugin/defaults";
import {DEFAULTS_PEAK_NOTE_STUB} from "./plugins/peak-note-stub-plugin/defaults";

export const defaultOptions = {
    ...setDefaults(DEFAULTS_PARAGRAPH, {}),
    ...setDefaults(DEFAULTS_MENTION, {}),
    ...setDefaults(PEAK_BLOCKQUOTE_OVERRIDES, DEFAULTS_BLOCKQUOTE),
    ...setDefaults(DEFAULTS_IMAGE, {}),
    ...setDefaults(DEFAULTS_MEDIA_EMBED, {}),
    ...setDefaults(PEAK_LIST_SPECIFIC_STYLE, DEFAULTS_LIST),
    ...setDefaults(DEFAULTS_ALIGN, {}),
    ...setDefaults(DEFAULTS_BOLD, {}),
    ...setDefaults(DEFAULTS_ITALIC, {}),
    ...setDefaults(DEFAULTS_UNDERLINE, {}),
    ...setDefaults(PEAK_STRIKETHROUGH_OVERRIDES, DEFAULTS_STRIKETHROUGH),
    ...setDefaults(DEFAULTS_SUBSUPSCRIPT, {}),
    ...setDefaults(DEFAULTS_PEAK_HEADING, {}),
    ...setDefaults(DEFAULTS_CODE, {}),
    // ...setDefaults(DEFAULTS_PEAK_CODE_BLOCK, {}),
    ...setDefaults(PEAK_CODE_BLOCK_OVERRIDES, DEFAULTS_CODE_BLOCK),
    ...setDefaults(DEFAULTS_CALLOUT, {}),
    ...setDefaults(DEFAULTS_PEAK_KNOWLEDGE, {}),
    ...setDefaults(DEFAULTS_PEAK_NOTE_STUB, {}),
};
