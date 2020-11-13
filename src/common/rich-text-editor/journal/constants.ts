import {
    BlockquotePlugin,
    BoldPlugin,
    CodePlugin,
    ELEMENT_BLOCKQUOTE,
    ELEMENT_CODE_BLOCK,
    ELEMENT_PARAGRAPH,
    ExitBreakPlugin,
    ImagePlugin, isBlockAboveEmpty, isSelectionAtBlockStart,
    ItalicPlugin,
    ListPlugin,
    ParagraphPlugin, ResetBlockTypePlugin,
    SlatePlugin,
    SoftBreakPlugin,
    StrikethroughPlugin,
    UnderlinePlugin,
    withInlineVoid, withList,
    withTrailingNode
} from "@udecode/slate-plugins";
import {
    setEditorPlugins,
    defaultOptions, setEditorNormalizers, DraggableNodeConfig,
} from "../defaults";
import {withEditableJournalEntry} from "../plugins/journal-entry-plugin/withEditableJournalEntry";
import {CALLOUT, HEADER_TYPES, JOURNAL_ENTRY, JOURNAL_ENTRY_HEADER, TITLE} from "../constants";
import {JournalEntry} from "../../../redux/wikiPageSlice";
import {getCurrentFormattedDate} from "../../../utils/time";
import {PeakCompletedPlugin} from "../plugins/completed-plugin/CompletedPlugin";
import {PeakHeadingPlugin} from "../plugins/peak-heading-plugin/TextHeadingPlugin";
import {PeakLinkPlugin} from "../plugins/peak-link-plugin/PeakLinkPlugin";
import {PeakCalloutPlugin} from "../plugins/peak-callout-plugin/PeakCalloutPlugin";
import {Editor} from "slate";

export const JOURNAL_PAGE_ID = "journal"
export const EMPTY_NODE = [{ type: "p", children: [{text: ""}]}]
// TODO: SHOULD THE BODY BE EMPTY_NODE?!?!?
export const EMPTY_JOURNAL_STATE: JournalEntry[] = [{
    entry_date: getCurrentFormattedDate(),
    body: [{children: [{text: ""}]}],
}]

// const journalDraggableOptions = [{ ...defaultOptions.p, level: 2 }, ...baseDraggableComponentOptions].map(styleDraggableOptions);

// const options = {
//     ...defaultOptions,
//     ...Object.fromEntries(journalDraggableOptions),
// };
// export const journalPlugins = [
//     ParagraphPlugin(options),
//     CodePlugin(options),
//     ListPlugin(options),
//     BlockquotePlugin(options),
//     ImagePlugin(options),
//     BoldPlugin(options),
//     ItalicPlugin(options),
//     UnderlinePlugin(options),
//     SoftBreakPlugin({
//         rules: [
//             {
//                 hotkey: 'enter',
//                 query: {
//                     allow: [ELEMENT_BLOCKQUOTE, JOURNAL_ENTRY, CALLOUT],
//                 },
//             },
//         ],
//     }),
//     StrikethroughPlugin(options),
//     ResetBlockTypePlugin({
//         rules: [
//             {
//                 types: [ELEMENT_BLOCKQUOTE, CALLOUT],
//                 hotkey: ['Enter'],
//                 predicate: isBlockAboveEmpty
//             },
//             {
//                 types: [...HEADER_TYPES, ELEMENT_BLOCKQUOTE, CALLOUT],
//                 hotkey: ['Backspace'],
//                 predicate: isSelectionAtBlockStart
//             }
//         ]
//     }),
//     // TODO. Pass options into these.
//     PeakCompletedPlugin(),
//     PeakHeadingPlugin(),
//     PeakLinkPlugin(),
//     PeakCalloutPlugin(),
//     ExitBreakPlugin({
//         rules: [
//             {
//                 hotkey: 'mod+enter',
//                 query: {
//                     allow: [ELEMENT_BLOCKQUOTE, CALLOUT],
//                 },
//                 level: 2
//             },
//             {
//                 hotkey: 'mod+shift+enter',
//                 before: true,
//             },
//             {
//                 hotkey: 'enter',
//                 query: {
//                     allow: [...HEADER_TYPES, TITLE],
//                 },
//             },
//         ],
//     })
// ];
//
// export const journalNormalizers = [
//     ...baseNormalizers,
//     withList(options),
//     withEditableJournalEntry,
//     withInlineVoid({ plugins: journalPlugins, voidTypes: [ELEMENT_CODE_BLOCK, JOURNAL_ENTRY_HEADER] }),
//     withTrailingNode({ type: ELEMENT_PARAGRAPH, level: 2 }),
// ] as const;


const journalSpecificDragConfig: DraggableNodeConfig[] = [{ ...defaultOptions.p, level: 2 }]
const journalSpecificPlugins: SlatePlugin[] = [
    ExitBreakPlugin({
        rules: [
            {
                hotkey: 'mod+enter',
                query: {
                    allow: [ELEMENT_BLOCKQUOTE, CALLOUT],
                },
                level: 2
            },
            {
                hotkey: 'mod+shift+enter',
                before: true,
            },
            {
                hotkey: 'enter',
                query: {
                    allow: [...HEADER_TYPES, TITLE],
                },
            },
        ],
    })
]
export const journalPlugins: SlatePlugin[] = setEditorPlugins(journalSpecificDragConfig, journalSpecificPlugins)
export const journalNormalizers = setEditorNormalizers(journalSpecificDragConfig, [withEditableJournalEntry, withInlineVoid({ plugins: journalPlugins, voidTypes: [ELEMENT_CODE_BLOCK, JOURNAL_ENTRY_HEADER] }), withTrailingNode({ type: ELEMENT_PARAGRAPH, level: 2 })])
