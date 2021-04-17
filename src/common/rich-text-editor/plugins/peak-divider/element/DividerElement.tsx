import {ClassName, getRootClassNames, RootStyleSet, StyledElementProps} from "@udecode/slate-plugins";
import React from "react";
import { getDividerElementStyles } from "./DividerElement.styles"
import { styled } from '@uifabric/utilities';
import {DividerElementStyleSet} from "../DividerElement.types";

const getClassNames = getRootClassNames<ClassName, DividerElementStyleSet>();

const DividerElementBase = ({attributes, children, className, styles, nodeProps, ...props}: StyledElementProps) => {
    const classNames = getClassNames(styles, {
        className,
        // Other style props
    });

    return (
        <div {...attributes} contentEditable={false} className={classNames.root}>
            <hr className={classNames.hr}/>
            {children }
        </div>
    );
};

export const DividerElement = styled<
    StyledElementProps,
    ClassName,
    RootStyleSet
    >(DividerElementBase, getDividerElementStyles, undefined, {
    scope: 'DividerElement',
});