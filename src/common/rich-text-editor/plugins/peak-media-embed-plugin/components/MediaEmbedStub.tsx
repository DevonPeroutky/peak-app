import React from "react";
import cn from "classnames";
import {ClassName, RootStyleSet, StyledElementProps} from "@udecode/slate-plugins";
import {styled} from "@uifabric/utilities";
import "./media-embed-stub.scss"
import {
    ELEMENT_IMAGE_EMBED,
    ELEMENT_MEDIA_EMBED,
    ELEMENT_TWITTER_EMBED,
    ELEMENT_YOUTUBE_EMBED,
    PEAK_MEDIA_EMBED
} from "../types";
import {PeakEditorControlDisplay} from "../../../../peak-toolbar/toolbar-controls";
import {
    PEAK_IMAGE_EMBED_STUB,
    PEAK_MEDIA_EMBED_STUB,
    PEAK_TWITTER_EMBED_STUB,
    PEAK_YOUTUBE_EMBED_STUB
} from "../constants";

const MediaEmbedStub = ({attributes, children, nodeProps, ...props}: StyledElementProps) => {
    console.log(props.element.embed_type)
    console.log(props)
    return (
        <div className={cn("peak-media-embed-stub")} {...attributes} contentEditable={false}>
            <div style={{ height: 0, overflow: "hidden" }}>{children}</div>
            {renderStub(props.element.embed_type)}
        </div>
    );
};

const renderStub = (embed_type: PEAK_MEDIA_EMBED) => {
    switch (embed_type) {
        case ELEMENT_IMAGE_EMBED:
            return <EmbedStub embed_stub={PEAK_IMAGE_EMBED_STUB}/>
        case ELEMENT_YOUTUBE_EMBED:
            return <EmbedStub embed_stub={PEAK_YOUTUBE_EMBED_STUB}/>
        case ELEMENT_TWITTER_EMBED:
            return <EmbedStub embed_stub={PEAK_TWITTER_EMBED_STUB}/>
        case ELEMENT_MEDIA_EMBED:
            return <EmbedStub embed_stub={PEAK_MEDIA_EMBED_STUB}/>
    }
}

const EmbedStub = (props: { embed_stub: PeakEditorControlDisplay }) => {
    const { embed_stub } = props
    return (
      <div className={"row"}>
          {embed_stub.icon}
          <span>{embed_stub.description}</span>
      </div>
  )
}

export const PeakMediaStubElement = styled<
    StyledElementProps,
    ClassName,
    RootStyleSet
    >(MediaEmbedStub, {}, undefined, {
    scope: 'PeakMediaEmbedStub',
});

