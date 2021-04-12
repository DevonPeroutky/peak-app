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

export const PEAK_MEDIA_EMBED_STUB: PeakEditorControlDisplay = {
    controlType: "block",
    icon: <BookOutlined className={"peak-editor-control-icon"}/>,
    label: "Rich Link Embed",
    description: "Insert a link as a rich visual bookmark",
    elementType: ELEMENT_EMBED_STUB,
    customFormat: (editor => insertMediaEmbedStub(editor, ELEMENT_MEDIA_EMBED)),
};
export const PEAK_TWITTER_EMBED_STUB: PeakEditorControlDisplay = {
    controlType: "block",
    icon: <TwitterOutlined className={"peak-editor-control-icon"}/>,
    label: "Tweet",
    description: "Embed a tweet",
    elementType: ELEMENT_EMBED_STUB,
    customFormat: (editor => insertMediaEmbedStub(editor, ELEMENT_TWITTER_EMBED)),
};
export const PEAK_YOUTUBE_EMBED_STUB: PeakEditorControlDisplay = {
    controlType: "block",
    icon: <YoutubeOutlined className={"peak-editor-control-icon"}/>,
    label: "Youtube Video",
    description: "Embed a youtube video",
    elementType: ELEMENT_EMBED_STUB,
    customFormat: (editor => insertMediaEmbedStub(editor, ELEMENT_YOUTUBE_EMBED)),
};
export const PEAK_IMAGE_EMBED_STUB: PeakEditorControlDisplay = {
    controlType: "block",
    icon: <PictureOutlined className={"peak-editor-control-icon"}/>,
    label: "Image",
    description: "Upload or embed with a link",
    elementType: ELEMENT_EMBED_STUB,
    customFormat: (editor => insertMediaEmbedStub(editor, ELEMENT_IMAGE_EMBED)),
};

export const PEAK_MEDIA_EMBED_CONTROLS = [PEAK_IMAGE_EMBED_STUB, PEAK_MEDIA_EMBED_STUB, PEAK_TWITTER_EMBED_STUB, PEAK_YOUTUBE_EMBED_STUB]