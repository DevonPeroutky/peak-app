import {
    CodeBlockKeyOption,
    CodeBlockPluginOptionsValues,
    ELEMENT_CODE_BLOCK
} from "@udecode/slate-plugins";
import PeakCodeEditor from "./code-editor/PeakCodeEditor";

export const DEFAULTS_PEAK_CODE_BLOCK: Record<
    CodeBlockKeyOption,
    CodeBlockPluginOptionsValues
    > = {
    code_block: {
        component: PeakCodeEditor,
        type: ELEMENT_CODE_BLOCK,
        rootProps: {
            className: 'slate-PEAK-code-block',
        },
    },
};