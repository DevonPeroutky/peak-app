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
            // @ts-ignore
            const linkText: string = element.children[0].text as string
            // @ts-ignore
            const linkUrl: string = element.url as string
            // @ts-ignore
            const linkId: string = element.id as string

            const currentHyperlink: PeakHyperlinkState = {
                currentHyperLinkId: linkId,
                currentLinkUrl: linkUrl,
                currentText: linkText,
                currentSelection: editor.selection
            };
            dispatch(openEditLinkMenu({ hyperlinkState: currentHyperlink} ));
        } else {
            // @ts-ignore
            const url: string = element.url as string
            if (url.startsWith("/")) {
                e.preventDefault()
                history.push(url);
            }
        }
    }

    // @ts-ignore
    const externalLink: boolean = isExternalLink(element.url as string)
    return (
        <a
            {...attributes}
            data-slate-type={ELEMENT_LINK}
            // @ts-ignore
            href={element.url as string}
            target={(externalLink) ? "_blank" : "_self"}
            className={"peak-hyperlink"}
            // @ts-ignore
            key={element.link as string}
            onClick={(e) => openUpMenu(e)}>
                {children}
        </a>
    )
}

