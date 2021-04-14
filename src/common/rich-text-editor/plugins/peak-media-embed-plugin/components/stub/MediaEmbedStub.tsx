import React, {useState} from "react";
import cn from "classnames";
import {StyledElementProps, useTSlateStatic} from "@udecode/slate-plugins";
import "./media-embed-stub.scss"
import {PeakMediaEmbedControl} from "../../constants";
import {Input, message, Modal} from "antd";
import {insertMediaEmbed, mapEmbeddedTypeToControlObject} from "../../utils";
import {ELEMENT_MEDIA_EMBED, LinkMetaData, PEAK_MEDIA_EMBED} from "../../types";
import {fetchLinkMetadata} from "../../../../../../client/linkMetadata";
import {useCurrentUser} from "../../../../../../utils/hooks";
import {sleep} from "../../../../../../chrome-extension/utils/generalUtil";

export const PeakMediaStubElement = ({attributes, children, nodeProps, ...props}: StyledElementProps) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [url, setUrl] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const editor = useTSlateStatic();
    const currentUser = useCurrentUser()

    const nodeId: number = props.element.id
    const embedType: PEAK_MEDIA_EMBED = props.element.embed_type
    const embedControl: PeakMediaEmbedControl = mapEmbeddedTypeToControlObject(embedType)

    const embedMedia = () => {
        console.log(`Submitting with `, url)
        const embedUrl = embedControl.validation(url)
        console.log(`Validated res `, embedUrl)

        if (!embedUrl) {
            message.error("The url doesn't look valid")
        } else if (embedType === ELEMENT_MEDIA_EMBED) {
            setLoading(true)
            fetchLinkMetadata(currentUser.id, embedUrl).then(res => {
                const linkMetadata: LinkMetaData = res.data
                sleep(250).then(_ => {
                    setLoading(true)
                    insertMediaEmbed(editor, nodeId, embedType, embedUrl, linkMetadata)
                    setIsModalVisible(false)
                })
            }).catch(_ => {
                sleep(250).then(_ => {
                    message.error("Recieved an error response trying to load the metadata for the webpage")
                    setLoading(false)
                })
            })
        } else {
            insertMediaEmbed(editor, nodeId, embedType, embedUrl)
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
                confirmLoading={loading}
                onCancel={() => resetContent()}>
                <Input placeholder={embedControl.inputPlaceholder} value={url} onChange={e => setUrl(e.target.value)} onPressEnter={embedMedia}/>
            </Modal>
        </>
    );
};
