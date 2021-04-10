import React from 'react';
import {RenderElementProps, useSlate} from "slate-react";
import {ELEMENT_PARAGRAPH, getRenderElement, SlatePlugin} from "@udecode/slate-plugins";
import {PeakTitle} from "./peak-title/PeakTitle";
import {TITLE} from "../../types";

// TODO: Remove this
// export const PeakTitlePlugin = (options?: any): SlatePlugin => ({
//     renderElement: renderPeakTitle(options),
// });
//
// // @ts-ignore
// export const renderPeakTitle = (options: any | undefined) => (props: RenderElementProps) => {
//     if (props.element.type === TITLE) {
//         return <PeakTitle {...props}/>
//     }
// };

export const PeakTitlePlugin = (): SlatePlugin => ({
    pluginKeys: ELEMENT_PARAGRAPH,
    renderElement: getRenderElement(ELEMENT_PARAGRAPH),
});