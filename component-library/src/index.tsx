import * as React from 'react'
import './rich-text-editor/components/index.scss'

interface Props {
  text: string
}

export const ExampleComponent = ({ text }: Props) => {
  return <div>Example Component: {text}</div>
}

export * from './rich-text-editor'
