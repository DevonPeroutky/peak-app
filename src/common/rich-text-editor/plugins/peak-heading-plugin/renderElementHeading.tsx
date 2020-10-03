import React, {useState} from 'react'
import {RenderElementProps} from "slate-react";
import {
    ELEMENT_H1,
    ELEMENT_H2,
    ELEMENT_H3,
    ELEMENT_H4,
    ELEMENT_H5,
    ELEMENT_H6,
    HeadingRenderElementOptions
} from "@udecode/slate-plugins";
import {message} from "antd";
import {LinkOutlined} from "@ant-design/icons/lib";
import "./peak-heading.scss"
import {HEADER_TYPES} from "../../constants";

export const renderElementHeading = ({ levels = 6 }: HeadingRenderElementOptions = {}) => (props: RenderElementProps) => {
    const {
        element: { type },
    } = props;

    if (levels >= 1 && HEADER_TYPES.includes(type as string)) {
        return <PeakHeading {...props} levels={levels}/>
    }
};

type PeakHeadingProps = RenderElementProps & { levels: number }
const PeakHeading = (props: PeakHeadingProps) => {
    const { levels, attributes, children} = props;
    const header_type = props.element.type
    const [showLink, setShowLink] = useState(false)
    const base_url = window.location.href.split('#')[0]
    const url = `${base_url}#${props.element.header_id as string}`

    const renderSpecificHeading = () => {
        if (levels >= 1 && header_type === ELEMENT_H1) return <h1 className={"peak-divider"} {...attributes}>{props.children}</h1>;
        if (levels >= 2 && header_type === ELEMENT_H2) return <h2 {...props} />;
        if (levels >= 3 && header_type === ELEMENT_H3) return <h3 {...props} />;
        if (levels >= 4 && header_type === ELEMENT_H4) return <h4 {...props} />;
        if (levels >= 5 && header_type === ELEMENT_H5) return <h5 {...props} />;
        if (levels >= 6 && header_type === ELEMENT_H6) return <h6 {...props} />;
    }

    const copyToKeyboard = () => {
        navigator.clipboard.writeText(url)
        message.info("Copied to clipboard!")
    }

    return (
        <div
            id={props.element.header_id as string}
            className={"peak-heading-container"}
            onMouseEnter={() => setShowLink(true)}
            onMouseLeave={() => setShowLink(false)}>
            <a href={`#${props.element.header_id as string}`}>
                <div style={{ height: 0, overflow: "hidden" }}>{props.children}</div>
                <LinkOutlined
                    {...attributes}
                    contentEditable={false}
                    href={`#${props.element.header_id as string}`}
                    className={(showLink) ? "header-link-overlay" : "hide" }
                    onClick={copyToKeyboard}/>
            </a>
            {renderSpecificHeading()}
        </div>
    )
}
