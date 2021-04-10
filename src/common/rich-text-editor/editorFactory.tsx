import React, {useMemo} from "react";
import {basePlugins} from "./base_plugins";
import {defaultOptions} from "./options";
import {createDeserializeHTMLPlugin, createNormalizeTypesPlugin, ELEMENT_H1, SlatePlugin, WithNormalizeTypes} from "@udecode/slate-plugins";

export const defaultEditableProps = {
    // placeholder: 'Enter some rich text…',
    spellCheck: true,
    autoFocus: true,
};

export const buildListOfPlugins = (additionalPlugins?: SlatePlugin[], additionalNormalizers?: WithNormalizeTypes): SlatePlugin[] => useMemo(() => {
    const plugins = (additionalPlugins) ? [...basePlugins, ...additionalPlugins] : basePlugins
    const editorSpecificRules = (additionalNormalizers) ? [...additionalNormalizers.rules] : []
    createNormalizeTypesPlugin({
        rules: [
            { path: [0, 0], strictType: defaultOptions[ELEMENT_H1].type },
            ...editorSpecificRules
        ],
    }),
    plugins.push(createDeserializeHTMLPlugin({ plugins }));
    return plugins
}, [defaultOptions]);
