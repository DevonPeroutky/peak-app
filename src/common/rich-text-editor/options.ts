import {DEFAULTS_CALLOUT} from "./plugins/peak-callout-plugin/defaults";
import {DEFAULTS_PEAK_KNOWLEDGE} from "./plugins/peak-knowledge-plugin/defaults";
import {
    ELEMENT_ALIGN_CENTER,
    ELEMENT_ALIGN_JUSTIFY,
    ELEMENT_ALIGN_LEFT,
    ELEMENT_ALIGN_RIGHT,
} from '@udecode/slate-plugins-alignment';
import {
    DEFAULTS_BOLD,
    DEFAULTS_CODE,
    DEFAULTS_ITALIC,
    DEFAULTS_STRIKETHROUGH,
    DEFAULTS_SUBSCRIPT,
    DEFAULTS_SUPERSCRIPT,
    DEFAULTS_UNDERLINE,
    MARK_BOLD,
    MARK_CODE,
    MARK_ITALIC,
    MARK_STRIKETHROUGH,
    MARK_SUBSCRIPT,
    MARK_SUPERSCRIPT,
    MARK_UNDERLINE,
} from '@udecode/slate-plugins-basic-marks';
import {
    DEFAULTS_BLOCKQUOTE,
    ELEMENT_BLOCKQUOTE,
} from '@udecode/slate-plugins-block-quote';
import {
    DEFAULTS_CODE_BLOCK,
    ELEMENT_CODE_BLOCK,
    ELEMENT_CODE_LINE,
} from '@udecode/slate-plugins-code-block';
import { SlatePluginOptions } from '@udecode/slate-plugins-core';
import { MARK_SEARCH_HIGHLIGHT } from '@udecode/slate-plugins-find-replace';
import {
    DEFAULTS_H1,
    DEFAULTS_H2,
    DEFAULTS_H3,
    ELEMENT_H1,
    ELEMENT_H2,
    ELEMENT_H3,
    ELEMENT_H4,
    ELEMENT_H5,
    ELEMENT_H6,
} from '@udecode/slate-plugins-heading';
import {
    DEFAULTS_HIGHLIGHT,
    MARK_HIGHLIGHT,
} from '@udecode/slate-plugins-highlight';
import { ELEMENT_IMAGE } from '@udecode/slate-plugins-image';
import { MARK_KBD } from '@udecode/slate-plugins-kbd';
import { ELEMENT_LINK } from '@udecode/slate-plugins-link';
import {
    DEFAULTS_TODO_LIST,
    ELEMENT_LI,
    ELEMENT_OL,
    ELEMENT_TODO_LI,
    ELEMENT_UL,
} from '@udecode/slate-plugins-list';
import { ELEMENT_MEDIA_EMBED } from '@udecode/slate-plugins-media-embed';
import { ELEMENT_MENTION } from '@udecode/slate-plugins-mention';
import {
    DEFAULTS_PARAGRAPH,
    ELEMENT_PARAGRAPH,
} from '@udecode/slate-plugins-paragraph';
import {
    DEFAULTS_TD,
    DEFAULTS_TH,
    ELEMENT_TABLE,
    ELEMENT_TD,
    ELEMENT_TH,
    ELEMENT_TR,
} from '@udecode/slate-plugins-table';

import {PEAK_CALLOUT} from "./plugins/peak-callout-plugin/defaults";
import {ELEMENT_PEAK_BOOK, PEAK_LEARNING} from "./plugins/peak-knowledge-plugin/constants";
import {HEADER_TYPES, JOURNAL_ENTRY, PeakPluginOption, TITLE} from "./types";
import {isBlockAboveEmpty, isSelectionAtBlockStart, SlatePluginKey, StyledElement } from "@udecode/slate-plugins";

const PEAK_STRIKETHROUGH_OPTIONS = {
    strikethrough: {
        hotkey: 'mod+shift+x',
    }
}

const PEAK_OL_LIST_OPTIONS: PeakPluginOption = {
    ol: {
        component: StyledElement,
        type: ELEMENT_OL,
        rootProps: {
            className: 'slate-ol peak-ol',
            as: 'ol',
        },
        hotkey: ['mod+opt+9', 'mod+shift+9'],
    },
}

const PEAK_UL_LIST_OPTIONS: PeakPluginOption = {
    ul: {
        component: StyledElement,
        type: ELEMENT_UL,
        rootProps: {
            className: 'slate-ul peak-ul',
            as: 'ul',
        },
        hotkey: ['mod+opt+8', 'mod+shift+8'],
    },
}

const PEAK_LIST_SPECIFIC_STYLE: PeakPluginOption = {
    li: {
        component: StyledElement,
        type: ELEMENT_LI,
        rootProps: {
            className: 'slate-li peak-li',
            as: 'li',
        },
    },
};

const PEAK_BLOCKQUOTE_OPTIONS = {
    blockquote: {
        rootProps: {
            className: 'slate-blockquote peak-blockquote',
            as: 'blockquote'
        }
    }
}

const PEAK_CODE_BLOCK_OPTIONS = {
    code_block: {
        rootProps: {
            className: 'slate-code-block peak-code-block',
        }
    }
}

const PEAK_PARAGRAPH_OPTIONS = {
    p: {
        rootProps: {
            className: 'slate-p peak-paragraph',
        }
    }
}

export const PEAK_EXIT_BREAK_OPTIONS = {
    rules: [
        {
            hotkey: 'mod+enter',
            query: {
                allow: [ELEMENT_BLOCKQUOTE, PEAK_CALLOUT, PEAK_LEARNING, ELEMENT_PEAK_BOOK, ELEMENT_CODE_BLOCK],
                filter: (entry => {
                    const [node, path] = Array.from(entry)
                    // TODO: DO WE NEED THIS CHECK??
                    return path.length === 3
                })
            },
        },
        {
            hotkey: 'mod+enter',
            query: {
                allow: [ELEMENT_BLOCKQUOTE, PEAK_CALLOUT, PEAK_LEARNING, ELEMENT_PEAK_BOOK, ELEMENT_CODE_BLOCK],
                filter: (entry => {
                    const [node, path] = Array.from(entry)
                    // TODO: DO WE NEED THIS CHECK??
                    return path.length === 2
                })
            },
        },
        {
            hotkey: 'mod+shift+enter',
            before: true,
        },
        {
            hotkey: 'enter',
            query: {
                start: true,
                end: true,
                allow: [...HEADER_TYPES, TITLE],
            },
        },
    ],
}

export const PEAK_SOFT_BREAK_OPTIONS = {
    rules: [
        {
            hotkey: 'enter',
            query: {
                allow: [ELEMENT_BLOCKQUOTE, JOURNAL_ENTRY, PEAK_CALLOUT, PEAK_LEARNING, ELEMENT_PEAK_BOOK, ELEMENT_CODE_BLOCK],
            },
        },
    ],
}

export const PEAK_RESET_BLOCK_OPTIONS = {
    rules: [
        {
            types: [ELEMENT_BLOCKQUOTE, PEAK_CALLOUT, ELEMENT_CODE_BLOCK],
            hotkey: ['Enter'],
            defaultType: ELEMENT_PARAGRAPH,
            predicate: isBlockAboveEmpty,
        },
        {
            types: [ELEMENT_BLOCKQUOTE, PEAK_CALLOUT, ELEMENT_CODE_BLOCK ],
            hotkey: ['Backspace'],
            defaultType: ELEMENT_PARAGRAPH,
            predicate: isSelectionAtBlockStart,
        }
    ]
}


const PEAK_DEFAULTS_H1 = {
    rootProps: {
        className: `slate-peak-${ELEMENT_H1} peak-divider`,
    },
};

const PEAK_DEFAULTS_H2 = {
    rootProps: {
        className: `slate-peak-${ELEMENT_H2} peak-divider`,
    },};

const PEAK_DEFAULTS_H3 = {
    rootProps: {
        className: `slate-peak-${ELEMENT_H3} peak-divider`,
    },};

const PEAK_HEADING_OPTIONS = {
    h1: {
        rootProps: {
            className: `slate-peak-${ELEMENT_H1} peak-divider`,
        },
    },
    h2: {
        rootProps: {
            className: `slate-peak-${ELEMENT_H2} peak-divider`,
        },
    },
    h3: {
        rootProps: {
            className: `slate-peak-${ELEMENT_H3} peak-divider`,
        },
    },
    h4: {
        rootProps: {
            className: `slate-peak-${ELEMENT_H4} peak-divider`,
        },
    },
    h5: {
        rootProps: {
            className: `slate-peak-${ELEMENT_H5} peak-divider`,
        },
    },
    h6: {
        rootProps: {
            className: `slate-peak-${ELEMENT_H6} peak-divider`,
        },
    },
}

/**
 * Get slate plugins options.
 * @param overrides merge into the default options
 */
export const createSlatePluginsOptions = <T extends string = string>(
    overrides?: Partial<Record<SlatePluginKey | T, Partial<SlatePluginOptions>>>
) => {
    const options: Record<SlatePluginKey, Partial<SlatePluginOptions>> = {
        [ELEMENT_ALIGN_CENTER]: {},
        [ELEMENT_ALIGN_JUSTIFY]: {},
        [ELEMENT_ALIGN_LEFT]: {},
        [ELEMENT_ALIGN_RIGHT]: {},
        [ELEMENT_BLOCKQUOTE]: DEFAULTS_BLOCKQUOTE,
        [ELEMENT_CODE_BLOCK]: DEFAULTS_CODE_BLOCK,
        [ELEMENT_CODE_LINE]: {},
        [ELEMENT_H1]: DEFAULTS_H1,
        [ELEMENT_H2]: DEFAULTS_H2,
        [ELEMENT_H3]: DEFAULTS_H3,
        [ELEMENT_H4]: {},
        [ELEMENT_H5]: {},
        [ELEMENT_H6]: {},
        [ELEMENT_IMAGE]: {},
        [ELEMENT_LI]: {},
        [ELEMENT_LINK]: {},
        [ELEMENT_MEDIA_EMBED]: {},
        [ELEMENT_MENTION]: {},
        [ELEMENT_OL]: {},
        [ELEMENT_PARAGRAPH]: DEFAULTS_PARAGRAPH,
        [ELEMENT_TABLE]: {},
        [ELEMENT_TD]: DEFAULTS_TD,
        [ELEMENT_TH]: DEFAULTS_TH,
        [ELEMENT_TODO_LI]: DEFAULTS_TODO_LIST,
        [ELEMENT_TR]: {},
        [ELEMENT_UL]: {},
        [MARK_BOLD]: DEFAULTS_BOLD,
        [MARK_CODE]: DEFAULTS_CODE,
        [MARK_HIGHLIGHT]: DEFAULTS_HIGHLIGHT,
        [MARK_ITALIC]: DEFAULTS_ITALIC,
        [MARK_KBD]: {},
        [MARK_SEARCH_HIGHLIGHT]: {},
        [MARK_STRIKETHROUGH]: DEFAULTS_STRIKETHROUGH,
        [MARK_SUBSCRIPT]: DEFAULTS_SUBSCRIPT,
        [MARK_SUPERSCRIPT]: DEFAULTS_SUPERSCRIPT,
        [MARK_UNDERLINE]: DEFAULTS_UNDERLINE,
    };

    console.log(`INITIAL OPTIONS `, options)
    if (overrides) {
        Object.keys(overrides).forEach((key) => {
            options[key] = overrides[key];
        });
    }

    Object.keys(options).forEach((key) => {
        options[key].type = key;
    });
    console.log(`OVERRIDED OPTIONS `, options)

    return options as Record<SlatePluginKey | T, SlatePluginOptions>;
};

// May need to do something more like:
// ...setDefaults(PEAK_STRIKETHROUGH_OPTIONS, DEFAULTS_STRIKETHROUGH),
// export const defaultOptions = createSlatePluginsOptions({
//     [ELEMENT_BLOCKQUOTE]: PEAK_BLOCKQUOTE_OPTIONS,
//     [ELEMENT_PARAGRAPH]: PEAK_PARAGRAPH_OPTIONS,
//     'learning': DEFAULTS_PEAK_KNOWLEDGE,
//     [PEAK_CALLOUT]: DEFAULTS_CALLOUT,
//     [ELEMENT_CODE_BLOCK]: PEAK_CODE_BLOCK_OPTIONS,
//     [MARK_STRIKETHROUGH]: PEAK_STRIKETHROUGH_OPTIONS,
//
//     // Can we just unpack these objects?
//     [ELEMENT_H1]: PEAK_DEFAULTS_H1,
//     [ELEMENT_H2]: PEAK_DEFAULTS_H2,
//     [ELEMENT_H3]: PEAK_DEFAULTS_H3,
//     [ELEMENT_UL]: PEAK_UL_LIST_OPTIONS,
//     [ELEMENT_OL]: PEAK_OL_LIST_OPTIONS,
//     [ELEMENT_LI]: PEAK_LIST_SPECIFIC_STYLE
// })
export const defaultOptions = createSlatePluginsOptions()
