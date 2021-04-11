import {
    BlockquoteElementBase,
    ClassName,
    CodeBlockElementBase,
    getBlockquoteElementStyles,
    getCodeBlockElementStyles,
    RootStyleSet, StyledElement,
    StyledElementProps, withProps
} from "@udecode/slate-plugins";
import {styled} from "@uifabric/utilities";
import {SlatePluginOptions} from "@udecode/slate-plugins-core";

export const PeakBlockquoteElement = styled<
    StyledElementProps,
    ClassName,
    RootStyleSet
    >(BlockquoteElementBase, getBlockquoteElementStyles({ className: "peak-blockquote" }), undefined, {
    scope: 'BlockquoteElement',
});

export const PEAK_OL_STYLE = withProps(StyledElement, {
    as: 'ol',
    className: 'slate-ol peak-ol',
})
export const PEAK_UL_STYLE = withProps(StyledElement, {
    className: 'slate-ul peak-ul',
    as: 'ul',
})

export const PEAK_LI_STYLE = withProps(StyledElement, {
    as: 'li',
    className: 'slate-li peak-li',
})
export const PeakCodeBlockElement = styled<
    StyledElementProps,
    ClassName,
    RootStyleSet
    >(CodeBlockElementBase, getCodeBlockElementStyles({ className: "peak-code-block"}), undefined, {
    scope: 'CodeBlockElement',
});
