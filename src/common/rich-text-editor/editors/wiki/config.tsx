import {createNormalizeTypesPlugin, WithNormalizeTypes } from "@udecode/slate-plugins";
import {TITLE} from "../../types";

export const wikiTitleEnforcer = createNormalizeTypesPlugin({
    rules: [{ path: [0], strictType: TITLE }],
})

