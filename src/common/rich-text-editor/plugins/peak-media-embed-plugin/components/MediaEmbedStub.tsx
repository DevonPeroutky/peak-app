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
import {
    PEAK_IMAGE_EMBED_STUB,
    PEAK_MEDIA_EMBED_STUB,
    PEAK_TWITTER_EMBED_STUB,
    PEAK_YOUTUBE_EMBED_STUB, PeakMediaEmbedControl
} from "../constants";
import {Input, message, Modal} from "antd";

const MediaEmbedStub = ({attributes, children, nodeProps, ...props}: StyledElementProps) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [url, setUrl] = useState<string | null>(null)

    const embedControl: PeakMediaEmbedControl = renderStub(props.element.embed_type)

    const embedMedia = () => {
        console.log(`Submitting with `, url)
        const embedUrl = embedControl.validation(url)
        console.log(`Validated res `, embedUrl)

        if (!embedUrl) {
            message.error("The url doesn't look valid")
        }


    }

    const resetContent = () => {
        setUrl("")
        setIsModalVisible(false)
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
                onOk={() => embedMedia()}
                onCancel={() => resetContent()}>
                <MediaEmbedInput embedControl={embedControl} url={url} setUrl={setUrl} submit={embedMedia}/>
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


const MediaEmbedInput = (props: {embedControl: PeakMediaEmbedControl, url: string | undefined, setUrl, submit}) => {
    const { embedControl, url, setUrl, submit } = props
    return (
        <div className={"peak-media-embed-input-container"}>
            <Input placeholder={embedControl.inputPlaceholder} value={url} onChange={e => setUrl(e.target.value)} onPressEnter={submit}/>
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

