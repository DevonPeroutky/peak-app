import * as React from 'react';
import {NodeContentSelect} from "./NodeContentSelect";
import {useNodeContentSelect} from "../useNodeContentSelect";

export const PeakInlineSelect = (props: {}) => {
    const {
        values,
        index,
        target,
        onAddNodeContent,
    } = useNodeContentSelect({
        maxSuggestions: 10,
        trigger: '/',
    });

    return (
        <NodeContentSelect
            at={target}
            valueIndex={index}
            options={values}
            onClickMention={onAddNodeContent}
        />
    )
}
