import React, {useEffect} from "react";
import Prism from "prismjs";
import cn from "classnames";
import "./prism-code-block.scss";

export const PrismCodeBlock = (props) => {
    const { attributes, htmlAttributes, children, className, element} = props

    useEffect(() => {
        Prism.highlightAll();
    }, []);
    console.log(`CHILDREN `, children)
    console.log(`ELEMENT `, element)

    return (
        <pre {...attributes} className={cn(className, "slate-code-block", "language-javascript")}{...htmlAttributes}>
          <code>{children}</code>
        </pre>
    )
}
