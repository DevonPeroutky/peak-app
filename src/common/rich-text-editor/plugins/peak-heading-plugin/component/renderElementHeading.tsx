import React, {useState} from 'react'
import {
    ELEMENT_H1,
    ELEMENT_H2,
    ELEMENT_H3,
    ELEMENT_H4,
    ELEMENT_H5,
    ELEMENT_H6,
} from "@udecode/slate-plugins";
import {message} from "antd";
import "./peak-heading.scss"
import {PeakHeadingProps} from "../types";

export const PeakHeading = (props: PeakHeadingProps) => {
    const { levels, attributes, children} = props;
    const header_type = props.element.type
    const [showLink, setShowLink] = useState(false)
    const base_url = window.location.href.split('#')[0]
    const url = `${base_url}#${props.element.header_id as string}`

    // @ts-ignore
    const renderSpecificHeading = () => {
        if (header_type === ELEMENT_H1) return <h1 className={"peak-divider"} {...attributes}>{props.children}</h1>;
        if (header_type === ELEMENT_H2) return <h2 {...props} />;
        if (header_type === ELEMENT_H3) return <h3 {...props} />;
        if (header_type === ELEMENT_H4) return <h4 {...props} />;
        if (header_type === ELEMENT_H5) return <h5 {...props} />;
        if (header_type === ELEMENT_H6) return <h6 {...props} />;
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
            </a>
            {renderSpecificHeading()}
        </div>
    )
}
