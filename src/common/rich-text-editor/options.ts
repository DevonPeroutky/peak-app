import {DEFAULTS_CALLOUT} from "./plugins/peak-callout-plugin/defaults";
import {DEFAULTS_PEAK_KNOWLEDGE} from "./plugins/peak-knowledge-plugin/defaults";
import {
    createSlatePluginsOptions,
    DEFAULTS_PARAGRAPH,
    ELEMENT_BLOCKQUOTE,
    ELEMENT_CODE_BLOCK,
    ELEMENT_H1,
    ELEMENT_H2,
    ELEMENT_H3,
    ELEMENT_H4,
    ELEMENT_H5, ELEMENT_H6,
    ELEMENT_LI,
    ELEMENT_OL,
    ELEMENT_PARAGRAPH,
    ELEMENT_UL,
    isBlockAboveEmpty,
    isSelectionAtBlockStart,
    MARK_STRIKETHROUGH,
    StyledElement
} from "@udecode/slate-plugins";
import {PEAK_CALLOUT} from "./plugins/peak-callout-plugin/defaults";
import {ELEMENT_PEAK_BOOK, PEAK_LEARNING} from "./plugins/peak-knowledge-plugin/constants";
import {HEADER_TYPES, JOURNAL_ENTRY, TITLE} from "./types";

const PEAK_STRIKETHROUGH_OPTIONS = {
    strikethrough: {
        hotkey: 'mod+shift+x',
    }
}

const PEAK_LIST_SPECIFIC_STYLE = {
    ul: {
        component: StyledElement,
        type: ELEMENT_UL,
        rootProps: {
            className: 'slate-ul peak-ul',
            as: 'ul',
        },
    },
    ol: {
        component: StyledElement,
        type: ELEMENT_OL,
        rootProps: {
            className: 'slate-ol peak-ol',
            as: 'ol',
        },
    },
    li: {
        component: StyledElement,
        type: ELEMENT_LI,
        rootProps: {
            className: 'slate-li peak-li',
            as: 'li',
        },
    },
    ...DEFAULTS_PARAGRAPH,
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

// May need to do something more like:
// ...setDefaults(PEAK_STRIKETHROUGH_OPTIONS, DEFAULTS_STRIKETHROUGH),
export const defaultOptions = createSlatePluginsOptions({
    [ELEMENT_BLOCKQUOTE]: PEAK_BLOCKQUOTE_OPTIONS,
    [ELEMENT_PARAGRAPH]: PEAK_PARAGRAPH_OPTIONS,
    'learning': DEFAULTS_PEAK_KNOWLEDGE,
    [PEAK_CALLOUT]: DEFAULTS_CALLOUT,
    [ELEMENT_CODE_BLOCK]: PEAK_CODE_BLOCK_OPTIONS,
    [MARK_STRIKETHROUGH]: PEAK_STRIKETHROUGH_OPTIONS,

    // Can we just unpack these objects?
    [ELEMENT_H1]: PEAK_DEFAULTS_H1,
    [ELEMENT_H2]: PEAK_DEFAULTS_H2,
    [ELEMENT_H3]: PEAK_DEFAULTS_H3,
    [ELEMENT_LI]: PEAK_LIST_SPECIFIC_STYLE
})
