import React from 'react'
import './peak-callout.scss'
// eslint-disable-next-line no-unused-vars
import { StyledElementProps } from '@udecode/slate-plugins'

export const PeakCalloutElement = (props: StyledElementProps) => {
  return (
    <div className='peak-callout-container' {...props.attributes}>
      {props.children}
    </div>
  )
}
