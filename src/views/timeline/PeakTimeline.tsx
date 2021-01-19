import React, {useCallback, useMemo, useState} from "react";
import "./peak-timeline.scss"

// Import the Slate editor factory.
import {createEditor, Editor, Transforms} from 'slate'

// Import the Slate components and React plugin.
import { Slate, Editable, withReact } from 'slate-react'
import {ELEMENT_CODE_BLOCK, ELEMENT_PARAGRAPH} from "@udecode/slate-plugins";

export const PeakTimeline = (props: {}) => {
    const editor = useMemo(() => withReact(createEditor()), []);

    const bro: any = [
        {
            type: ELEMENT_PARAGRAPH,
            children: [{text: 'A line of text in a paragraph.'}],
        }
    ]

    const [value, setValue] = useState(bro);

    const renderElement = useCallback(props => {
        switch (props.element.type) {
            case ELEMENT_CODE_BLOCK:
                return <CodeElement {...props} />
            default:
                return <DefaultElement {...props} />
        }
    }, []);

    return (
        <div className="peak-timeline-container">
            <h1 className="peak-timeline-header">Timeline</h1>
            <div>Swag</div>
        </div>
    )
};

const CodeElement = (props: any) => {
    return (
        <pre {...props.attributes}>
      <code>{props.children}</code>
    </pre>
    )
}

const DefaultElement = (props: any) => {
    return <p {...props.attributes}>{props.children}</p>
}