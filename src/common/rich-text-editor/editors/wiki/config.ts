import {PeakTitlePlugin} from "../../plugins/peak-title-plugin/PeakTitlePlugin";
import {
    SlatePlugin,
    WithNormalizeTypes,
} from "@udecode/slate-plugins";
import {TITLE} from "../../types";
import {buildListOfPlugins} from "../../editorFactory";

const wikiSpecificPlugins: SlatePlugin[] = [ PeakTitlePlugin()]
const wikiNormalizers: WithNormalizeTypes = {
    rules: [{ path: [0, 0], strictType: TITLE }],
}

export const wikiPlugins: SlatePlugin[] = buildListOfPlugins(wikiSpecificPlugins, wikiNormalizers)
