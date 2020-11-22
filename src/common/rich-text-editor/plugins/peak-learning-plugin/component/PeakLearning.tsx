import {RenderElementProps} from "slate-react";
import React from "react";
import "./peak-learning.scss"

export const PeakLearning = (props: RenderElementProps) => {
    return (
        <div className={"peak-learning-container"} {...props.attributes}>{props.children}</div>
    )
}
