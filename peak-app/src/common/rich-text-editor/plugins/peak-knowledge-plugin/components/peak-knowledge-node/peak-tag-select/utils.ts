import {TAG_COLORS} from "./constants";
import {PeakTag} from "../../../../../../../types";

export const calculateNextColor = (tags: PeakTag[], selected_tags: PeakTag[]) => {
    console.log(`CALCULATING TAGS for tags `, tags)
    if ( tags.length === 0 ) {
        const randomColorIndex = getRandomInt(TAG_COLORS.length)
        console.log(`RANDOM COLOR INDEX: `, randomColorIndex)
        return TAG_COLORS[randomColorIndex]
    }

    console.log(tags[tags.length - 1].color)
    const currColorIndex = TAG_COLORS.indexOf(tags[tags.length - 1].color) + Math.max(selected_tags.length, 1)
    const colorSlots = TAG_COLORS.length - 1
    const colorIndex = currColorIndex % colorSlots
    console.log(currColorIndex)
    console.log(colorSlots)
    console.log(colorIndex)
    return TAG_COLORS[colorIndex]
}

// Return a random number between 0 - max (Exclusive)
// Example `getRandomInt(3)` --> Returns 0, 1, or 2
function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}
