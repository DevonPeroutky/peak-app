import {Editor, Transforms} from "slate";
import {ELEMENT_CODE_BLOCK, ELEMENT_PARAGRAPH, unwrapList} from "@udecode/slate-plugins";
import {PEAK_LEARNING} from "./defaults";
import {TAG_COLORS} from "./constants";
import {PeakDisplayTag} from "./component/PeakLearning";


export const createLearning = (editor: Editor) => {
    unwrapList(editor);
    // Transforms.removeNodes(editor)
    Transforms.insertNodes(editor, [
        {
            type: PEAK_LEARNING,
            children: [{children: [{text: ''}], type: ELEMENT_PARAGRAPH}]
        },
        {
            type: ELEMENT_PARAGRAPH,
            children: [{text: ' '}]
        }
    ]);
}

export const calculateNextColor = (tags: PeakDisplayTag[]) => {
    if ( tags.length === 0 ) return TAG_COLORS[0]

    const currColorIndex = TAG_COLORS.indexOf(tags[0].color)
    return (currColorIndex === TAG_COLORS.length - 1) ? TAG_COLORS[0] : TAG_COLORS[currColorIndex + 1]
}