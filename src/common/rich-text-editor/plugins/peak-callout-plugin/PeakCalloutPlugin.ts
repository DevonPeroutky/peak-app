import {deserializeCode, SlatePlugin} from "@udecode/slate-plugins";
import {renderCustomPeakElement} from "../custom-renderer";

export const PeakCalloutPlugin = (options?: any): SlatePlugin => ({
    renderElement: renderCustomPeakElement(options),
    deserialize: deserializeCode(),
});
