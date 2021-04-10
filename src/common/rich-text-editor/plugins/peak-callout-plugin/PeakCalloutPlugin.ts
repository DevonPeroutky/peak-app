import {
    getCodeBlockDecorate,
    getCodeBlockDeserialize,
    getCodeBlockOnKeyDown,
    getCodeBlockRenderLeaf,
    getRenderElement,
    SlatePlugin,
    withCodeBlock,
} from "@udecode/slate-plugins";
import {DEFAULTS_CALLOUT, PEAK_CALLOUT} from "./defaults";

// export const PeakCalloutPlugin = (options?: any): SlatePlugin => ({
//     renderElement: renderElementPeakCallout(options),
//     // deserialize: deserializeCode(),
// });
//
// const renderElementPeakCallout = (
//     options?: any
// ) => {
//     const { callout } = setDefaults(options, DEFAULTS_CALLOUT);
//     return getRenderElement(callout);
// };

export const PeakCalloutPlugin = (): SlatePlugin => ({
    pluginKeys: PEAK_CALLOUT,
    renderElement: getRenderElement(PEAK_CALLOUT),
    renderLeaf: getCodeBlockRenderLeaf(),
    deserialize: getCodeBlockDeserialize(),
    decorate: getCodeBlockDecorate(),
    onKeyDown: getCodeBlockOnKeyDown(),
    withOverrides: withCodeBlock(),
});