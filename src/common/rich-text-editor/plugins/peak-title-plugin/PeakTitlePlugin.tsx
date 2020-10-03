import React from 'react';
import {RenderElementProps, useSlate} from "slate-react";
import {SlatePlugin} from "@udecode/slate-plugins";
import {PeakTitle} from "./peak-title/PeakTitle";
import {TITLE} from "../../constants";

export const PeakTitlePlugin = (options?: any): SlatePlugin => ({
    renderElement: renderPeakTitle(options),
});

export const renderPeakTitle = (options: any | undefined) => (props: RenderElementProps) => {
    if (props.element.type === TITLE) {
        return <PeakTitle {...props}/>
    }
};
