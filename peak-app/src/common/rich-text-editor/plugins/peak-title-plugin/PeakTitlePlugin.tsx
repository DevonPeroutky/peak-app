import React from 'react';
import {
    getRenderElement,
    SlatePlugin
} from "@udecode/slate-plugins";
import {TITLE} from "../../types";

export const createPeakTitlePlugin = (): SlatePlugin => ({
    pluginKeys: TITLE,
    renderElement: getRenderElement(TITLE),
});
