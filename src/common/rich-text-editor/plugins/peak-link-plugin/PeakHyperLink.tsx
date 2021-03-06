import {RenderElementProps, useSlate} from "slate-react";
import {useDispatch} from "react-redux";
import {openEditLinkMenu, useActiveEditorState} from "../../../../redux/slices/activeEditor/activeEditorSlice";
import React from "react";
import {ELEMENT_LINK, LinkPluginOptions} from "@udecode/slate-plugins";
import {useHistory} from "react-router-dom";
import {PeakHyperlinkState} from "../../../../constants/wiki-types";
import "./peak-hyperlink.scss"

const PeakHyperLink = (props: RenderElementProps) => {
    const {
        element,
        children,
        attributes,
    } = props;
    const dispatch = useDispatch();
    const editorState = useActiveEditorState()
    const editor = useSlate();
    let history = useHistory();

    const openUpMenu = (e: any) => {
        if (editorState.isEditing) {
            const linkText: string = element.children[0].text as string
            const linkUrl: string = element.url as string
            const linkId: string = element.id as string

            const currentHyperlink: PeakHyperlinkState = {
                currentHyperLinkId: linkId,
                currentLinkUrl: linkUrl,
                currentText: linkText,
                currentSelection: editor.selection
            };
            dispatch(openEditLinkMenu({ hyperlinkState: currentHyperlink} ));
        } else {
            const url: string = element.url as string
            if (url.startsWith("/")) {
                e.preventDefault()
                history.push(url);
            }
        }
    }

    return (
        <a
            {...attributes}
            data-slate-type={ELEMENT_LINK}
            href={element.link as string}
            target="_blank"
            className={"peak-hyperlink"}
            key={element.link as string}
            onClick={(e) => openUpMenu(e)}>
                {children}
        </a>
    )
}

// @ts-ignore
export const renderElementLink = ({ }: LinkPluginOptions = {}) => (props: RenderElementProps) => {
    if (props.element.type == ELEMENT_LINK) {
        return <PeakHyperLink {...props}/>
    }
};

export default renderElementLink;
