import {ELEMENT_IMAGE, getSlatePluginType, insertImage, insertNodes, setNodes, SPEditor, TElement} from "@udecode/slate-plugins";
import {Editor, Transforms} from "slate";
import {
    ELEMENT_EMBED_STUB,
    ELEMENT_MEDIA_EMBED,
    ELEMENT_TWITTER_EMBED,
    ELEMENT_YOUTUBE_EMBED,
    PEAK_MEDIA_EMBED
} from "./types";
import {EMPTY_PARAGRAPH_NODE} from "../../editors/constants";
import {
    PEAK_IMAGE_EMBED_STUB,
    PEAK_MEDIA_EMBED_STUB,
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
        case ELEMENT_IMAGE:
            return PEAK_IMAGE_EMBED_STUB
        case ELEMENT_YOUTUBE_EMBED:
            return PEAK_YOUTUBE_EMBED_STUB
        case ELEMENT_TWITTER_EMBED:
            return PEAK_TWITTER_EMBED_STUB
        case ELEMENT_MEDIA_EMBED:
            return PEAK_MEDIA_EMBED_STUB
    }
}

export const insertMediaEmbed = (editor: SPEditor, stubNodeId: number, mediaEmbedType: PEAK_MEDIA_EMBED, embedded_url: string, additionalProps?) => {
    console.log(`Looking for node with id: ${mediaEmbedType} - ${stubNodeId}. NEW URL: ${embedded_url}`)

    const [stubNode] = Editor.nodes(editor, {
        at: [],
        match: n => (n.id === stubNodeId && n.embed_type === mediaEmbedType)
    })
    console.log(`Node `, stubNode[0])
    console.log(`Path `, stubNode[1])

    // https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/American_bison_k5680-1.jpg/1920px-American_bison_k5680-1.jpg
    insertMediaEmbedded(editor, mediaEmbedType, embedded_url, stubNode[1], additionalProps)
}

export const insertMediaEmbedded = (editor: SPEditor, mediaEmbedType: PEAK_MEDIA_EMBED, url: string | ArrayBuffer, path: number[], additionalProps) => {
    Transforms.removeNodes(editor, { at: path })
    const text = { text: '' };
    const image = {
        type: mediaEmbedType,
        url,
        children: [text],
        ...additionalProps
    };
    insertNodes<TElement>(editor, image, { at: path });
};