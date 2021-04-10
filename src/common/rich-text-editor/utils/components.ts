import {createSlatePluginsComponents, ELEMENT_H1, ELEMENT_H2, ELEMENT_H3,
    ELEMENT_H4,
    ELEMENT_H5, ELEMENT_H6, ELEMENT_PARAGRAPH, withPlaceholders} from "@udecode/slate-plugins";



export const withDefaultStyledPlaceHolders = (components: any) =>
    withPlaceholders(components, [
        {
            key: ELEMENT_PARAGRAPH,
            placeholder: 'Type a paragraph',
            hideOnBlur: true,
        },
        {
            key: ELEMENT_H1,
            placeholder: 'Heading 1',
            hideOnBlur: false,
        },
        {
            key: ELEMENT_H2,
            placeholder: 'Heading 2',
            hideOnBlur: false,
        },
        {
            key: ELEMENT_H3,
            placeholder: 'Heading 3',
            hideOnBlur: false,
        },
        {
            key: ELEMENT_H4,
            placeholder: 'Heading 4',
            hideOnBlur: false,
        },
        {
            key: ELEMENT_H5,
            placeholder: 'Heading 5',
            hideOnBlur: false,
        },
        {
            key: ELEMENT_H6,
            placeholder: 'Heading 6',
            hideOnBlur: false,
        },
    ]);

const defaultSlatePluginComponents = createSlatePluginsComponents();
export const defaultComponents = withDefaultStyledPlaceHolders(defaultSlatePluginComponents);