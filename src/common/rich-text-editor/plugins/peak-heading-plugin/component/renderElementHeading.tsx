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
        if (header_type === ELEMENT_H2) return <h2 {...attributes}>{props.children}</h2>;
        if (header_type === ELEMENT_H3) return <h3 {...attributes}>{props.children}</h3>;
        if (header_type === ELEMENT_H4) return <h4 {...attributes}>{props.children}</h4>;
        if (header_type === ELEMENT_H5) return <h5 {...attributes}>{props.children}</h5>;
        if (header_type === ELEMENT_H6) return <h6 {...attributes}>{props.children}</h6>;
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
            {renderSpecificHeading()}
        </div>
    )
}
