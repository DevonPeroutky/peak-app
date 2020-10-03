/* eslint-disable @typescript-eslint/ban-ts-ignore */
import Prism from 'prismjs';
import * as React from 'react';
import {decoratePreview, renderLeafPreview, SlatePlugin} from "@udecode/slate-plugins";
import { RenderLeafProps } from 'slate-react';
import styled, { css } from 'styled-components';
import {update, cloneDeep} from 'lodash';
import "./peak-code-leaf.scss"

export const PeakInlinePlugin = (): SlatePlugin => ({
    decorate: decoratePreview(),
    renderLeaf: renderPeakLeafPreview(),
});

interface PreviewLeafProps {
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
    title?: boolean;
    list?: boolean;
    hr?: boolean;
    blockquote?: boolean;
    code?: boolean;
}

const PreviewLeaf = styled.span<PreviewLeafProps>`
  font-weight: ${({ bold }) => bold && 'bold'};
  font-style: ${({ italic }) => italic && 'italic'};
  text-decoration: ${({ underline }) => underline && 'underline'};
  
  ${({ title }) =>
    title &&
    css`
      display: inline-block;
      font-weight: bold;
      font-size: 20px;
      margin: 20px 0 10px 0;
    `}
  ${({ list }) =>
    list &&
    css`
      padding-left: 10px;
      font-size: 20px;
      line-height: 10px;
    `}
  ${({ hr }) =>
    hr &&
    css`
      display: block;
      text-align: center;
      border-bottom: 2px solid #ddd;
    `}
  ${({ blockquote }) =>
    blockquote &&
    css`
      display: inline-block;
      border-left: 2px solid #ddd;
      padding-left: 10px;
      color: #aaa;
      font-style: italic;
    `}
  ${({ code }) =>
    code &&
    css`
      font-family: monospace;
      background-color: #eee;
      padding: 3px;
    `}
`;

export const renderPeakLeafPreview = () => ({
                                            attributes,
                                            children,
                                            leaf,
                                        }: RenderLeafProps) => {
    console.log(leaf)
    console.log(leaf.text)
    const newLeaf = leaf.text.substring(1, leaf.text.length - 1)
    console.log(newLeaf)

    if (leaf.code) {
        // return (
        //     <PreviewLeaf {...attributes} {...leaf}>
        //         {children}
        //     </PreviewLeaf>
        // );
        return (
            <>
                <div style={{ height: 0, overflow: "hidden" }}>{children}</div>
                <PeakCodeLeaf attributes={attributes} text={newLeaf}/>
            </>
        );
    } else {
        return (
            <PreviewLeaf {...attributes} {...leaf}>
                {children}
            </PreviewLeaf>
        )
    }
}


const PeakCodeLeaf = (props: { text: string, attributes: any}) => {
    return (
        <span className="peak-code-leaf" {...props.attributes}>
            {props.text}
        </span>
    )
}

// @ts-ignore
// eslint-disable-next-line
Prism.languages.markdown=Prism.languages.extend("markup",{}),Prism.languages.insertBefore("markdown","prolog",{blockquote:{pattern:/^>(?:[\t ]*>)*/m,alias:"punctuation"},code:[{pattern:/^(?: {4}|\t).+/m,alias:"keyword"},{pattern:/``.+?``|`[^`\n]+`/,alias:"keyword"}],title:[{pattern:/\w+.*(?:\r?\n|\r)(?:==+|--+)/,alias:"important",inside:{punctuation:/==+$|--+$/}},{pattern:/(^\s*)#+.+/m,lookbehind:!0,alias:"important",inside:{punctuation:/^#+|#+$/}}],hr:{pattern:/(^\s*)([*-])([\t ]*\2){2,}(?=\s*$)/m,lookbehind:!0,alias:"punctuation"},list:{pattern:/(^\s*)(?:[*+-]|\d+\.)(?=[\t ].)/m,lookbehind:!0,alias:"punctuation"},"url-reference":{pattern:/!?\[[^\]]+\]:[\t ]+(?:\S+|<(?:\\.|[^>\\])+>)(?:[\t ]+(?:"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\((?:\\.|[^)\\])*\)))?/,inside:{variable:{pattern:/^(!?\[)[^\]]+/,lookbehind:!0},string:/(?:"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\((?:\\.|[^)\\])*\))$/,punctuation:/^[\[\]!:]|[<>]/},alias:"url"},bold:{pattern:/(^|[^\\])(\*\*|__)(?:(?:\r?\n|\r)(?!\r?\n|\r)|.)+?\2/,lookbehind:!0,inside:{punctuation:/^\*\*|^__|\*\*$|__$/}},italic:{pattern:/(^|[^\\])([*_])(?:(?:\r?\n|\r)(?!\r?\n|\r)|.)+?\2/,lookbehind:!0,inside:{punctuation:/^[*_]|[*_]$/}},url:{pattern:/!?\[[^\]]+\](?:\([^\s)]+(?:[\t ]+"(?:\\.|[^"\\])*")?\)| ?\[[^\]\n]*\])/,inside:{variable:{pattern:/(!?\[)[^\]]+(?=\]$)/,lookbehind:!0},string:{pattern:/"(?:\\.|[^"\\])*"(?=\)$)/}}}}),Prism.languages.markdown.bold.inside.url=Prism.util.clone(Prism.languages.markdown.url),Prism.languages.markdown.italic.inside.url=Prism.util.clone(Prism.languages.markdown.url),Prism.languages.markdown.bold.inside.italic=Prism.util.clone(Prism.languages.markdown.italic),Prism.languages.markdown.italic.inside.bold=Prism.util.clone(Prism.languages.markdown.bold); // prettier-ignore
