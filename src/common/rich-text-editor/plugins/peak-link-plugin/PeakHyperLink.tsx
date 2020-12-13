import {RenderElementProps, useSlate} from "slate-react";
import {useCurrentWikiPage} from "../../../../utils/hooks";
import {useDispatch} from "react-redux";
import {openEditLinkMenu, PeakHyperlinkState} from "../../../../redux/wikiPageSlice";
import React from "react";
import {ELEMENT_LINK, LinkPluginOptions} from "@udecode/slate-plugins";
import {useHistory} from "react-router-dom";

const PeakHyperLink = (props: RenderElementProps) => {
    const {
        element,
        children,
        attributes,
    } = props;
    const peakWikiPage = useCurrentWikiPage();
    const dispatch = useDispatch();
    const editor = useSlate();
    let history = useHistory();

    const openUpMenu = (e: any) => {
        if (peakWikiPage.editorState.isEditing) {
            const linkText: string = element.children[0].text as string
            const linkUrl: string = element.url as string
            const linkId: string = element.id as string

            const currentHyperlink: PeakHyperlinkState = {
                currentHyperLinkId: linkId,
                currentLinkUrl: linkUrl,
                currentText: linkText,
                currentSelection: editor.selection
            };
            dispatch(openEditLinkMenu({ pageId: peakWikiPage.id, hyperlinkState: currentHyperlink} ));
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
            href={element.url as string}
            target="_blank"
            key={element.url as string}
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
