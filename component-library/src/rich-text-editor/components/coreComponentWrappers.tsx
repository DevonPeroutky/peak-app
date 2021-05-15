import {
  BlockquoteElementBase,
  CodeBlockElementBase,
  getBlockquoteElementStyles,
  getCodeBlockElementStyles,
  StyledElement,
  withProps
} from '@udecode/slate-plugins'
import { styled } from '@uifabric/utilities'

export const PeakBlockquoteElement = styled(
  BlockquoteElementBase,
  getBlockquoteElementStyles({ className: 'peak-blockquote' }),
  undefined,
  {
    scope: 'BlockquoteElement'
  }
)

export const PEAK_OL_STYLE = withProps(StyledElement, {
  as: 'ol',
  className: 'slate-ol peak-ol'
})
export const PEAK_UL_STYLE = withProps(StyledElement, {
  className: 'slate-ul peak-ul',
  as: 'ul'
})

export const PEAK_LI_STYLE = withProps(StyledElement, {
  as: 'li',
  className: 'slate-li peak-li'
})
export const PeakCodeBlockElement = styled(
  CodeBlockElementBase,
  getCodeBlockElementStyles({ className: 'peak-code-block' }),
  undefined,
  {
    scope: 'CodeBlockElement'
  }
)
