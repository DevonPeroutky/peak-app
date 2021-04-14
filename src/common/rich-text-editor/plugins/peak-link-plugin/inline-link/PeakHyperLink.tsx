import {RenderElementProps, useSlate} from "slate-react";
import {useDispatch} from "react-redux";
import {openEditLinkMenu, useActiveEditorState} from "../../../../../redux/slices/activeEditor/activeEditorSlice";
import React from "react";
import {ClassName, ELEMENT_LINK, RootStyleSet, StyledElementProps} from "@udecode/slate-plugins";
import {useHistory} from "react-router-dom";
import {PeakHyperlinkState} from "../../../../../constants/wiki-types";
import "./peak-hyperlink.scss"
import {isExternalLink} from "../link-util";

export const PeakInlineLinkElement = (props: RenderElementProps) => {
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

    const externalLink: boolean = isExternalLink(element.url as string)
    return (
        <a
            {...attributes}
            data-slate-type={ELEMENT_LINK}
            href={element.url as string}
            target={(externalLink) ? "_blank" : "_self"}
            className={"peak-hyperlink"}
            key={element.link as string}
            onClick={(e) => openUpMenu(e)}>
                {children}
        </a>
    )
}

