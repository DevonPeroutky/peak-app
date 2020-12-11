import {
    CodeBlockPluginOptions,
    CodeBlockRenderElementOptions,
    deserializeCodeBlock,
    getRenderElement,
    setDefaults,
    SlatePlugin
} from "@udecode/slate-plugins";
import {DEFAULTS_PEAK_CODE_BLOCK} from "./defaults";
import {peakCodeEditorOnKeyDownHandler} from "./utils";

export const PeakCodePlugin = (options?: CodeBlockPluginOptions): SlatePlugin => ({
    renderElement: renderPeakCodeElement(options),
    deserialize: deserializeCodeBlock(options),
    onKeyDown: peakCodeEditorOnKeyDownHandler
});


const renderPeakCodeElement = (
    options?: CodeBlockRenderElementOptions
) => {
    const { code_block } = setDefaults(options, DEFAULTS_PEAK_CODE_BLOCK);
    return getRenderElement(code_block);
};



