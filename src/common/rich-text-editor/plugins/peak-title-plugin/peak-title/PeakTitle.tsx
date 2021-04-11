import React from "react";
import {Node} from "slate";
import cn from "classnames";
import {ClassName, RootStyleSet, StyledElementProps} from "@udecode/slate-plugins";
import {styled} from "@uifabric/utilities";
import "./peak-title.scss"

const PeakTitleBase = ({attributes, children, nodeProps, ...props}: StyledElementProps) => {
    const titleText: string = Node.string(props.element)
    return (
        <div className={cn("peak-page-title wiki-title", (!titleText) ? "empty-title" : "")} {...attributes}>
            {children}
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

