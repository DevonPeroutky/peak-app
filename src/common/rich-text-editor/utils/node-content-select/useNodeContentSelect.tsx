import { useCallback, useState } from 'react';
import { Editor, Range, Transforms, Node } from 'slate';
import {
    autoformatBlock,
    getNextIndex,
    getPreviousIndex,
    getRangeFromBlockStart,
    isCollapsed,
    isPointAtWordEnd,
    isWordAfterTrigger,
    unwrapList,
    UseMentionOptions
} from "@udecode/slate-plugins";
import {PeakEditorControl} from "../../../peak-toolbar/toolbar-controls";

export const useNodeContentSelect = (
    mentionables: PeakEditorControl[] = [],
    { maxSuggestions = 10, trigger = '/', ...options }: UseMentionOptions = {}
) => {
    const [targetRange, setTargetRange] = useState<Range | null>(null);
    const [valueIndex, setValueIndex] = useState(0);
    const [search, setSearch] = useState('');
    const values = mentionables
        .filter((c) => c.label.toLowerCase().includes(search.toLowerCase()))
        .slice(0, maxSuggestions);

    const onAddNodeContent = useCallback(
        (editor: Editor, data: PeakEditorControl) => {
            if (targetRange !== null) {
                console.log(`WTF #1`)
                Transforms.select(editor, targetRange);
                insertNodeContent(editor, data, targetRange)
                return setTargetRange(null);
            }
        },
        [options, targetRange]
    );

    const onKeyDownMention = useCallback(
        (e, editor: Editor) => {
            if (targetRange) {
                if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    return setValueIndex(getNextIndex(valueIndex, values.length - 1));
                }
                if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    return setValueIndex(getPreviousIndex(valueIndex, values.length - 1));
                }
                if (e.key === 'Escape') {
                    e.preventDefault();
                    return setTargetRange(null);
                }

                if (['Tab', 'Enter'].includes(e.key)) {
                    e.preventDefault();
                    if (values.length) {
                        onAddNodeContent(editor, values[valueIndex])
                        return false
                    } else {
                        Editor.insertBreak(editor)
                    }
                }
            }
        },
        [
            values,
            valueIndex,
            setValueIndex,
            targetRange,
            setTargetRange,
            onAddNodeContent,
        ]
    );

    const onChangeMention = useCallback(
        (editor: Editor) => {
            const { selection } = editor;

            if (selection && isCollapsed(selection)) {
                const cursor = Range.start(selection);

                const { range, match: beforeMatch } = isWordAfterTrigger(editor, {
                    at: cursor,
                    trigger,
                });

                if (beforeMatch && isPointAtWordEnd(editor, { at: cursor })) {
                    setTargetRange(range as Range);
                    const [, word] = beforeMatch;
                    setSearch(word);
                    setValueIndex(0);
                    return;
                }
            }

            setTargetRange(null);
        },
        [setTargetRange, setSearch, setValueIndex, trigger]
    );

    return {
        search,
        index: valueIndex,
        target: targetRange,
        values,
        onChangeMention,
        onKeyDownMention,
        onAddNodeContent,
    };
};

export const insertNodeContent = async (
    editor: Editor,
    selectedOption: PeakEditorControl,
    targetRange: Range
) => {
    const rangeFromBlockStart = getRangeFromBlockStart(editor) as Range;
    autoformatBlock(editor, selectedOption.elementType, rangeFromBlockStart, {
        preFormat: () => {
            unwrapList(editor);
        },
        format: selectedOption.customFormat
    });
    Transforms.insertText(editor, '', { at: editor.selection! } )
};
