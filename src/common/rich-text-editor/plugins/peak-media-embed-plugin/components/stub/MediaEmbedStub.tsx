import React, {useState} from "react";
import cn from "classnames";
import {StyledElementProps, useTSlateStatic} from "@udecode/slate-plugins";
import "./media-embed-stub.scss"
import { PeakMediaEmbedControl } from "../../constants";
import {Input, message, Modal} from "antd";
import {insertMediaEmbed, mapEmbeddedTypeToControlObject} from "../../utils";
import {PEAK_MEDIA_EMBED} from "../../types";

export const PeakMediaStubElement = ({attributes, children, nodeProps, ...props}: StyledElementProps) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [url, setUrl] = useState<string | null>(null)
    const editor = useTSlateStatic();

    const nodeId: number = props.element.id
    const embedType: PEAK_MEDIA_EMBED = props.element.embed_type
    const embedControl: PeakMediaEmbedControl = mapEmbeddedTypeToControlObject(embedType)

    const embedMedia = () => {
        console.log(`Submitting with `, url)
        const embedUrl = embedControl.validation(url)
        console.log(`Validated res `, embedUrl)

        if (!embedUrl) {
            message.error("The url doesn't look valid")
        } else {
            insertMediaEmbed(editor, nodeId, embedType, embedUrl)
            setIsModalVisible(false)
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
