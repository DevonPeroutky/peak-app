import {RenderElementProps, useSlate} from "slate-react";
import React from "react";
import "./peak-callout.scss"
import {ClassName, RootStyleSet, StyledElementProps} from "@udecode/slate-plugins";
import {styled} from "@uifabric/utilities";

const PeakCallout = (props: RenderElementProps) => {
    return (
        <div className={"peak-callout-container"} {...props.attributes}>{props.children}</div>
    )
}

export const PeakCalloutElement = styled<
    StyledElementProps,
    ClassName,
    RootStyleSet
    >(PeakCallout, {}, undefined, {
    scope: 'PeakCallout',
});

