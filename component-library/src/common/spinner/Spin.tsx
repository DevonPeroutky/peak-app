import React from 'react'
import cn from 'classnames'

export const DefaultSpinner = (props: { className?: string }) => {
  return <div className={cn(props.className, 'spinner')} />
}
