import {
    DEFAULTS_PARAGRAPH, ELEMENT_CODE_BLOCK,
    ELEMENT_LI,
    ELEMENT_OL,
    ELEMENT_UL,
    ListKeyOption,
    ListPluginOptionsValues,
    StyledElement
} from "@udecode/slate-plugins";

export const PEAK_STRIKETHROUGH_OVERRIDES = {
    strikethrough: {
        hotkey: 'mod+shift+x',
    }
}

export const PEAK_LIST_SPECIFIC_STYLE: Record<ListKeyOption, ListPluginOptionsValues> = {
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

export const PEAK_BLOCKQUOTE_OVERRIDES = {
    blockquote: {
        rootProps: {
            className: 'slate-blockquote peak-blockquote',
            as: 'blockquote'
        }
    }
}