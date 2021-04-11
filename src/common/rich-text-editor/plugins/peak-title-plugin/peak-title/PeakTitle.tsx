import React from "react";
import {Node} from "slate";
import cn from "classnames";
import {ClassName, RootStyleSet, StyledElementProps} from "@udecode/slate-plugins";
import {styled} from "@uifabric/utilities";
import "./peak-title.scss"

const PeakTitleBase = ({attributes, children, nodeProps, ...props}: StyledElementProps) => {
    console.log(`Props `, props)
    console.log(`Children `, children)
    const titleText: string = Node.string(props.element)
    return (
        <div className={"title-container"}>
            <span className={cn("peak-page-title", (!titleText) ? "empty-title" : "")} {...attributes}>
                {children}
            </span>
        </div>
    );
};

export const PeakTitleElement = styled<
    StyledElementProps,
    ClassName,
    RootStyleSet
    >(PeakTitleBase, {}, undefined, {
    scope: 'PeakTitle',
});

