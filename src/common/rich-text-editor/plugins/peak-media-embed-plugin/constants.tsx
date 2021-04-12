import {BookOutlined, PictureOutlined, TwitterOutlined, YoutubeOutlined} from "@ant-design/icons/lib";
import React from "react";
import {PeakEditorControlDisplay} from "../../../peak-toolbar/toolbar-controls";
import {
    ELEMENT_EMBED_STUB,
    ELEMENT_IMAGE_EMBED,
    ELEMENT_MEDIA_EMBED,
    ELEMENT_TWITTER_EMBED,
    ELEMENT_YOUTUBE_EMBED
} from "./types";
import {insertMediaEmbedStub} from "./utils";
import {isValidHttpUrl, parseTwitterId, parseYoutubeEmbedUrl} from "../../../../utils/urls";

export interface PeakMediaEmbedControl extends PeakEditorControlDisplay {
    inputPlaceholder: string
    contextString: string
    validation: (url: string) => string | undefined
}

export const PEAK_MEDIA_EMBED_STUB: PeakMediaEmbedControl = {
    controlType: "block",
    icon: <BookOutlined className={"peak-editor-control-icon"}/>,
    label: "Rich Link Embed",
    description: "Insert a link as a rich visual bookmark",
    elementType: ELEMENT_EMBED_STUB,
    customFormat: (editor => insertMediaEmbedStub(editor, ELEMENT_MEDIA_EMBED)),
    inputPlaceholder: "Paste in the https//...",
    contextString: "Embed a rich, visual preview of an external link",
    validation: (url) => (isValidHttpUrl(url)) ? url : undefined
};
export const PEAK_TWITTER_EMBED_STUB: PeakMediaEmbedControl = {
    controlType: "block",
    icon: <TwitterOutlined className={"peak-editor-control-icon"}/>,
    label: "Tweet",
    description: "Embed a tweet",
    elementType: ELEMENT_EMBED_STUB,
    customFormat: (editor => insertMediaEmbedStub(editor, ELEMENT_TWITTER_EMBED)),
    inputPlaceholder: "Paste in the link to a Tweet. Ex: https//twitter.com/...",
    contextString: "Works with links to Tweets",
    validation: (url) => parseTwitterId(url)
};
export const PEAK_YOUTUBE_EMBED_STUB: PeakMediaEmbedControl = {
    controlType: "block",
    icon: <YoutubeOutlined className={"peak-editor-control-icon"}/>,
    label: "Youtube Video",
    description: "Embed a youtube video",
    elementType: ELEMENT_EMBED_STUB,
    customFormat: (editor => insertMediaEmbedStub(editor, ELEMENT_YOUTUBE_EMBED)),
    inputPlaceholder: "Paste in link to the Youtube Video. Ex: https://youtube.com/...",
    contextString: "Only Youtube support for now. Vimeo is coming",
    validation: (url) => parseYoutubeEmbedUrl(url)
};
export const PEAK_IMAGE_EMBED_STUB: PeakMediaEmbedControl = {
    controlType: "block",
    icon: <PictureOutlined className={"peak-editor-control-icon"}/>,
    label: "Image",
    description: "Upload or embed with a link",
    elementType: ELEMENT_EMBED_STUB,
    customFormat: (editor => insertMediaEmbedStub(editor, ELEMENT_IMAGE_EMBED)),
    inputPlaceholder: "Paste the image link",
    contextString: "Works with any image from the web! Support for uploading images coming soon.",
    validation: (url) => (isValidHttpUrl(url)) ? url : undefined
};

export const PEAK_MEDIA_EMBED_CONTROLS = [PEAK_IMAGE_EMBED_STUB, PEAK_MEDIA_EMBED_STUB, PEAK_TWITTER_EMBED_STUB, PEAK_YOUTUBE_EMBED_STUB]