import {
    DEFAULTS_LINK,
    deserializeLink,
    setDefaults,
    SlatePlugin
} from "@udecode/slate-plugins";
import renderElementLink from "./PeakHyperLink";

export const PeakLinkPlugin = (options?: any): SlatePlugin => {
    const { link } = setDefaults(options, DEFAULTS_LINK);

    return {
        renderElement: renderElementLink(options),
        deserialize: deserializeLink(options),
        inlineTypes: [link.type],
    }
};
