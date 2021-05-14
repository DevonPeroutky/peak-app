// eslint-disable-next-line no-unused-vars
import { EditableProps } from 'slate-react/dist/components/editable'
import { createSlatePluginsOptions } from '@udecode/slate-plugins'

export const readOnlyProps: EditableProps = {
  // placeholder: 'Enter some rich text…',
  // style: editorStyle,
  spellCheck: false,
  readOnly: true
}

export const pluginOptions = createSlatePluginsOptions()
