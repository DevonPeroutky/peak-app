import {RenderElementProps, useSlate} from "slate-react";
import React from "react";
import "./peak-callout.scss"

export const PeakCallout = (props: RenderElementProps) => {
    return (
        <div className={"peak-callout-container"} {...props.attributes}>
            <div {...props}/>
        </div>
    )
}
