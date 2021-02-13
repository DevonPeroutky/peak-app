import {TAG_COLORS} from "./constants";
import {PeakTag} from "../../../../../../../types";

export const calculateNextColor = (tags: PeakTag[], selected_tags: PeakTag[]) => {
    if ( tags.length === 0 ) return TAG_COLORS[0]

    const currColorIndex = TAG_COLORS.indexOf(tags[tags.length - 1].color) + selected_tags.length
    const colorSlots = TAG_COLORS.length - 1
    const colorIndex = currColorIndex % colorSlots
    return TAG_COLORS[colorIndex]
}
