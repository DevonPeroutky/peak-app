import {getCodeBlockDecorate, getCodeBlockDeserialize,
    getCodeBlockOnKeyDown,
    getCodeBlockRenderLeaf, getRenderElement, KEYS_CODE_BLOCK, SlatePlugin, withCodeBlock } from "@udecode/slate-plugins";
import {DEFAULTS_PRISM_CODE_BLOCK} from "./defaults";

// TODO REMOVE THIS
// export const PrismJsCodeBlockPlugin = (options): SlatePlugin => ({
//     renderElement: renderPrismCodeElement(options),
//     renderLeaf: renderLeafCodeBlock(),
//     deserialize: deserializeCodeBlock(options),
//     decorate: decorateCodeBlock(),
//     onKeyDown: onKeyDownCodeBlock(options),
// });
//
// const renderPrismCodeElement = (
//     options?: CodeBlockRenderElementOptions
// ) => {
//     const { code_block, code_line } = setDefaults(options, DEFAULTS_PRISM_CODE_BLOCK);
//     return getRenderElements([code_block, code_line]);
// };

export const PrismJsCodeBlockPlugin = (): SlatePlugin => ({
    pluginKeys: KEYS_CODE_BLOCK,
    renderElement: getRenderElement(KEYS_CODE_BLOCK),
    renderLeaf: getCodeBlockRenderLeaf(),
    deserialize: getCodeBlockDeserialize(),
    decorate: getCodeBlockDecorate(),
    onKeyDown: getCodeBlockOnKeyDown(),
    withOverrides: withCodeBlock(),
});
