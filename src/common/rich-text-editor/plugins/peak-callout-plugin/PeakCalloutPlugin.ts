import {
    deserializeCode,
    getRenderElement,
    setDefaults,
    SlatePlugin,
} from "@udecode/slate-plugins";
import {DEFAULTS_CALLOUT} from "./defaults";

export const PeakCalloutPlugin = (options?: any): SlatePlugin => ({
    renderElement: renderElementPeakCallout(options),
    deserialize: deserializeCode(),
});

const renderElementPeakCallout = (
    options?: any
) => {
    const { callout } = setDefaults(options, DEFAULTS_CALLOUT);
    return getRenderElement(callout);
};
