import React from 'react'
import { Node } from 'slate'
import cn from 'classnames'
import './peak-title.scss'
// eslint-disable-next-line no-unused-vars
import { StyledElementProps } from '@udecode/slate-plugins'

export const PeakTitleElement = ({
  attributes,
  children,
  nodeProps,
  ...props
}: StyledElementProps) => {
  const titleText: string = Node.string(props.element)
  return (
    <div
      className={cn(
        'peak-page-title page-title',
        !titleText ? 'empty-title' : ''
      )}
      {...attributes}
    >
      {children}
    </div>
  )
}
