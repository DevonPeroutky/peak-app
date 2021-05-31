// eslint-disable-next-line no-unused-vars
import { EditableProps } from 'slate-react/dist/components/editable'
import { createSlatePluginsOptions } from '@udecode/slate-plugins'

export const editorStyle: React.CSSProperties = {
  minHeight: "100%",
  textAlign: "left",
  flex: "1 1 auto",
}

export const readOnlyProps: EditableProps = {
  // placeholder: 'Enter some rich text…',
  // style: editorStyle,
  placeholder: 'Mad knowledge here...',
  spellCheck: false,
  readOnly: true,
  style: editorStyle
}

export const pluginOptions = createSlatePluginsOptions()
