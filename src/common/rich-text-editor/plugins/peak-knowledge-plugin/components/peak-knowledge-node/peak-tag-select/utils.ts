import {TAG_COLORS} from "./constants";
import {PeakTag} from "../../../../../../../types";

export const calculateNextColor = (tags: PeakTag[]) => {
    if ( tags.length === 0 ) return TAG_COLORS[0]

    const currColorIndex = TAG_COLORS.indexOf(tags[0].color)
    return (currColorIndex === TAG_COLORS.length - 1) ? TAG_COLORS[0] : TAG_COLORS[currColorIndex + 1]
}
