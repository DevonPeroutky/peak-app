import {createNormalizeTypesPlugin, WithNormalizeTypes } from "@udecode/slate-plugins";
import { ELEMENT_TITLE } from "component-library";

export const wikiTitleEnforcer = createNormalizeTypesPlugin({
    rules: [{ path: [0], strictType: ELEMENT_TITLE }],
})

