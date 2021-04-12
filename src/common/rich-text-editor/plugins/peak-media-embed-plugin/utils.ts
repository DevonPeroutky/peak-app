import { SPEditor } from "@udecode/slate-plugins";
import { Transforms } from "slate";
import {
    ELEMENT_EMBED_STUB,
    ELEMENT_IMAGE_EMBED, ELEMENT_MEDIA_EMBED,
    ELEMENT_TWITTER_EMBED,
    ELEMENT_YOUTUBE_EMBED,
    PEAK_MEDIA_EMBED
} from "./types";
import {EMPTY_PARAGRAPH_NODE} from "../../editors/constants";
import {
    PEAK_IMAGE_EMBED_STUB, PEAK_MEDIA_EMBED_STUB,
    PEAK_TWITTER_EMBED_STUB,
    PEAK_YOUTUBE_EMBED_STUB,
    PeakMediaEmbedControl
} from "./constants";

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

export const mapEmbeddedTypeToControlObject = (embed_type: PEAK_MEDIA_EMBED): PeakMediaEmbedControl => {
    switch (embed_type) {
        case ELEMENT_IMAGE_EMBED:
            return PEAK_IMAGE_EMBED_STUB
        case ELEMENT_YOUTUBE_EMBED:
            return PEAK_YOUTUBE_EMBED_STUB
        case ELEMENT_TWITTER_EMBED:
            return PEAK_TWITTER_EMBED_STUB
        case ELEMENT_MEDIA_EMBED:
            return PEAK_MEDIA_EMBED_STUB
    }
}

export const insertMediaEmbed = (editor: SPEditor, mediaEmbedType: PEAK_MEDIA_EMBED) => {

}