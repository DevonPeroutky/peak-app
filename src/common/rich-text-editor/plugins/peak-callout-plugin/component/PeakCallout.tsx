import {RenderElementProps, useSlate} from "slate-react";
import React from "react";
import "./peak-callout.scss"

export const PeakCalloutElement = (props: RenderElementProps) => {
    return (
        <div className={"peak-callout-container"} {...props.attributes}>{props.children}</div>
    )
}
