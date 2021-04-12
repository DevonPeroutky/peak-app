import React, {useState} from "react";
import cn from "classnames";
import {ClassName, RootStyleSet, StyledElementProps} from "@udecode/slate-plugins";
import {styled} from "@uifabric/utilities";
import "./media-embed-stub.scss"
import { PeakMediaEmbedControl } from "../constants";
import {Input, message, Modal} from "antd";
import {mapEmbeddedTypeToControlObject} from "../utils";

const MediaEmbedStub = ({attributes, children, nodeProps, ...props}: StyledElementProps) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [url, setUrl] = useState<string | null>(null)

    const embedControl: PeakMediaEmbedControl = mapEmbeddedTypeToControlObject(props.element.embed_type)

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
                <Input placeholder={embedControl.inputPlaceholder} value={url} onChange={e => setUrl(e.target.value)} onPressEnter={embedMedia}/>
            </Modal>
        </>
    );
};

export const PeakMediaStubElement = styled<
    StyledElementProps,
    ClassName,
    RootStyleSet
    >(MediaEmbedStub, {}, undefined, {
    scope: 'PeakMediaEmbedStub',
});

