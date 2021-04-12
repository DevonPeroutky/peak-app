import { SPEditor } from "@udecode/slate-plugins";
import { Transforms } from "slate";
import {ELEMENT_EMBED_STUB, PEAK_MEDIA_EMBED} from "./types";
import {EMPTY_PARAGRAPH_NODE} from "../../editors/constants";

export const insertMediaEmbedStub = (editor: SPEditor, mediaEmbedType: PEAK_MEDIA_EMBED) => {
    const nodeId = Date.now()
    console.log(`CREATING A MEDIA EMBED STUB: ${mediaEmbedType}`)
    const mediaEmbedNode = {
        type: ELEMENT_EMBED_STUB,
        embed_type: mediaEmbedType,
        id: nodeId,
        children: [{text: ''}]
    }

    // DOESN'T WORK in first line of JOURNAL due to normalization error
    // Transforms.removeNodes(editor)
    Transforms.insertNodes(editor, [
        mediaEmbedNode,
        EMPTY_PARAGRAPH_NODE()
    ]);
}