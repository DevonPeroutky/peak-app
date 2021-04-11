import { getRenderElement, SlatePlugin } from "@udecode/slate-plugins";
import {PEAK_LEARNING} from "./constants";

export const createPeakLearningPlugin = (): SlatePlugin => ({
    pluginKeys: PEAK_LEARNING,
    renderElement: getRenderElement(PEAK_LEARNING),
});
