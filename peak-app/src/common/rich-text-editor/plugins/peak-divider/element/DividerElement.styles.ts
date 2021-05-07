import { ClassName, RootStyleSet } from '@udecode/slate-plugins-ui-fluent';
import {DividerElementStyleSet} from "../DividerElement.types";

export const getDividerElementStyles = ({ className }: ClassName): DividerElementStyleSet => ({
    root: [
        {
            // Insert css properties
            display: 'flex',
            flex: 1,
            alignItems: "center"
        },
        className,
    ],
    hr: {
        // Insert css properties
        flexGrow: 1,
        backgroundColor: 'rgb(230, 236, 241)',
        height: '2px',
        border: 'none',
        padding: '0px 0px',
        margin: 'calc(1.714em - 4px) 0px'
    }
});