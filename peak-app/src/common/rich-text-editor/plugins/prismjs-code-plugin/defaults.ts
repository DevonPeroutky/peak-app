import {
    CodeLineElement,
    ELEMENT_CODE_BLOCK, ELEMENT_CODE_LINE
} from "@udecode/slate-plugins";
import {PrismCodeBlock} from "./component/PrismCodeBlock";

export const DEFAULTS_PRISM_CODE_BLOCK = {
    code_block: {
        component: PrismCodeBlock,
        type: ELEMENT_CODE_BLOCK,
        rootProps: {
            className: 'slate-code-block',
        },
    },
    code_line: {
        component: CodeLineElement,
        type: ELEMENT_CODE_LINE,
        rootProps: {
            className: 'slate-code-line',
        },
    }
}
