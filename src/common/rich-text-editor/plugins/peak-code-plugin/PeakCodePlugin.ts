import {
    CodeBlockPluginOptions, CodeBlockRenderElementOptions, DEFAULTS_CODE_BLOCK,
    deserializeCodeBlock, getRenderElement, setDefaults,
    SlatePlugin
} from "@udecode/slate-plugins";
import {DEFAULTS_PEAK_CODE_BLOCK} from "./defaults";

export const PeakCodePlugin = (options?: CodeBlockPluginOptions): SlatePlugin => ({
    renderElement: renderPeakCodeElement(options),
    deserialize: deserializeCodeBlock(options),
});


const renderPeakCodeElement = (
    options?: CodeBlockRenderElementOptions
) => {
    const { code_block } = setDefaults(options, DEFAULTS_PEAK_CODE_BLOCK);
    return getRenderElement(code_block);
};




