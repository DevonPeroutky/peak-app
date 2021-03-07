import {
    CodeBlockPluginOptions,
    CodeBlockRenderElementOptions,
    decorateCodeBlock,
    deserializeCodeBlock,
    getRenderElements,
    onKeyDownCodeBlock,
    renderLeafCodeBlock,
    setDefaults,
    SlatePlugin
} from "@udecode/slate-plugins";
import {DEFAULTS_PRISM_CODE_BLOCK} from "./defaults";

export const PrismJsCodeBlockPlugin = (
    options?: CodeBlockPluginOptions
): SlatePlugin => ({
    renderElement: renderPrismCodeElement(options),
    renderLeaf: renderLeafCodeBlock(),
    deserialize: deserializeCodeBlock(options),
    decorate: decorateCodeBlock(),
    onKeyDown: onKeyDownCodeBlock(options),
});

const renderPrismCodeElement = (
    options?: CodeBlockRenderElementOptions
) => {
    const { code_block, code_line } = setDefaults(options, DEFAULTS_PRISM_CODE_BLOCK);
    return getRenderElements([code_block, code_line]);
};

