import React, {useState} from "react";
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
    PEAK_YOUTUBE_EMBED_STUB, PeakMediaEmbedControl
} from "../constants";
import {Input, Modal} from "antd";

const MediaEmbedStub = ({attributes, children, nodeProps, ...props}: StyledElementProps) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [url, setUrl] = useState<string | null>(null)

    const embedControl: PeakMediaEmbedControl = renderStub(props.element.embed_type)

    const embedMedia = () => {

    }

    return (
        <>
            <div className={cn("peak-media-embed-stub")} {...attributes} contentEditable={false} onClick={() => setIsModalVisible(true)}>
                <div style={{ height: 0, overflow: "hidden" }}>{children}</div>
                {
                    <div className={"row"}>
                        {embedControl.icon}
                        <span>{embedControl.description}</span>
                    </div>
                }
            </div>
            <Modal
                visible={isModalVisible}
                maskClosable={true}
                mask={true}
                keyboard={true}
                title={embedControl.description}
                okText={"Embed"}
                onOk={() => setIsModalVisible(false)}
                onCancel={() => setIsModalVisible(false)}>
                <MediaEmbedInput embedControl={embedControl}/>
            </Modal>
        </>
    );
};

const renderStub = (embed_type: PEAK_MEDIA_EMBED): PeakMediaEmbedControl => {
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


const MediaEmbedInput = (props: {embedControl: PeakMediaEmbedControl}) => {
    const { embedControl } = props
    return (
        <div className={"peak-media-embed-input-container"}>
            <Input placeholder={embedControl.inputPlaceholder} />
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

