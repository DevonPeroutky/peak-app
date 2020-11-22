import {
    CodeBlockPluginOptions,
    SlatePlugin
} from "@udecode/slate-plugins";
import {renderJournalElement} from "./journal-entry/renderJournalElement";

export const JournalEntryPlugin = (options?: CodeBlockPluginOptions): SlatePlugin => ({
    renderElement: renderJournalElement(options),
});

