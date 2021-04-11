import {Editor, Point, Range} from 'slate';
import {
    AutoformatRule, ELEMENT_CODE_BLOCK,
    MARK_BOLD,
    MARK_CODE,
    MARK_ITALIC,
    MARK_STRIKETHROUGH,
    SPEditor,
    unwrapList,
    WithAutoformatOptions,
} from "@udecode/slate-plugins";
import {NODE_CONTENT_TYPES, PeakEditorControl} from "../../peak-toolbar/toolbar-controls";

const AUTO_REPLACE: { [key: string]: string } = {
    '-->': '→',
    '<--': '←',
    '--': '⸺'
};
// const MARKDOWN_LINK_REGEX = /^\[([\w\s\d]+)\]\(((?:\/|https?:\/\/)[\w\d./?=#]+)\)$/
const MARKDOWN_LINK_REGEX = /\[([^\[]+)\](\(.*\))/gm
// const myMatch = string.match(regex)


export const withAutoReplace = <T extends SPEditor>(editor: T) => {
    const { insertText } = editor;

    editor.insertText = text => {
        const { selection } = editor;

        if ((text === ' ' || text === '\n') && selection && Range.isCollapsed(selection)) {
            const { anchor } = selection;
            const { focus } = selection;
            const block = Editor.above(editor, {
                match: n => Editor.isBlock(editor, n),
            });
            const path = block ? block[1] : [];
            const start: Point = Editor.start(editor, path);
            const range: Range = { anchor, focus: start };

            const beforeText = Editor.string(editor, range);
            const found = Object.keys(AUTO_REPLACE).find(matcher => beforeText.endsWith(matcher));

            if (found) {
                const afterText = AUTO_REPLACE[found];

                let existing: number = found.length
                while (existing > 0) {
                    Editor.deleteBackward(editor, {unit: "character"} );
                    existing-=1
                }

                Editor.insertText(editor, afterText);
            }
        }

        insertText(text);
    };

    return editor;
};

const convertToAutoFormatRule = (editorControl: PeakEditorControl) => {
    return {
        type: editorControl.elementType,
        trigger: editorControl.trigger,
        preFormat: (editor: SPEditor) => unwrapList(editor),
        markup: editorControl.markup,
        format: editorControl.customFormat
    } as AutoformatRule
}

const blockAutoFormatRules: AutoformatRule[] = NODE_CONTENT_TYPES.map(convertToAutoFormatRule)
const inlineAutoFormatRules: AutoformatRule[] = [
    {
        type: MARK_BOLD,
        between: ['**', '**'],
        mode: 'inline',
        insertTrigger: true,
    },
    {
        type: MARK_BOLD,
        between: ['__', '__'],
        mode: 'inline',
        insertTrigger: true,
    },
    {
        type: MARK_ITALIC,
        between: ['*', '*'],
        mode: 'inline',
        insertTrigger: true,
    },
    {
        type: MARK_ITALIC,
        between: ['_', '_'],
        mode: 'inline',
        insertTrigger: true,
    },
    {
        type: MARK_CODE,
        between: ['`', '`'],
        mode: 'inline',
        insertTrigger: true,
    },
    {
        type: MARK_STRIKETHROUGH,
        between: ['~~', '~~'],
        mode: 'inline',
        insertTrigger: true,
    }
]

export const PEAK_AUTOFORMAT_OPTIONS: WithAutoformatOptions = {
    rules: [...blockAutoFormatRules, ...inlineAutoFormatRules]
}
export const chromeExtFormatRules: AutoformatRule[] = [...blockAutoFormatRules, ...inlineAutoFormatRules].filter(r => r.type !== ELEMENT_CODE_BLOCK)
