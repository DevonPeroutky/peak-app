import React, {useRef, useEffect, useState, Ref} from 'react'
import { ReactEditor } from 'slate-react';
import {Editor, Range, Transforms, Location, Node, Point} from 'slate';
import {Button, Input, message} from "antd";
import "./link-menu.scss"
import {useDispatch} from "react-redux";
import {any} from "ramda";
import {unWrapLink, upsertLink} from "../link-util";
import {AlignLeftOutlined} from "@ant-design/icons/lib";
import {DisplayLinkMenu} from "./link-menu-body/display-link-menu/DisplayLinkMenu";
import HierarchySearcherInput from "./hierarchy-searcher/HierarchySearcherInput";
import {closeLinkMenu} from "../../../../../redux/slices/activeEditor/activeEditorSlice";
import {PeakHyperlinkState} from "../../../../../constants/wiki-types";
import { useTSlate } from '@udecode/slate-plugins';

interface LinkMenuProps {
    showLinkMenu: boolean
    linkState: PeakHyperlinkState
}
const LinkMenu = (props: LinkMenuProps) => {
    const { showLinkMenu, linkState } = props
    const dispatch = useDispatch()
    const searchInputEl = useRef(null);
    const textInputEl = useRef(null);
    const [isEditing, setEditing] = useState(true)

    const ref = useRef<HTMLInputElement>(null);
    const editor = useTSlate();
    const [savedSelection, setSavedSelection] = useState<Range | null>(null);
    const [isDropdownOpen, setDropdownOpen] = useState<boolean>(false)

    // These will be to new Text/URL combo
    const [text, setText] = useState<string>('');
    const [url, setUrl] = useState<string>('');

    const closeOnEscapeHandler = (e: any) => {
        if (e.key === "Escape") {
            if (showLinkMenu) {
                closeMenu()
            }
        }
    }

    const handleClickOutside = (event: any) => {
        const pathClassNames: string[] = [...event.path].map(div => (div.className) ? div.className : "")
        const wasDropdownClicked: boolean = (pathClassNames) ? any((cn: any) => {
            return (typeof(cn) === "string") ? cn.includes("hierarchy-search-dropdown") : false
        }, pathClassNames) : false

        if (showLinkMenu && ref.current && !ref.current.contains(event.target) && !wasDropdownClicked) {
            closeMenu(false)
        }
    }

    const openLinkMenu = async (el: any) => {
        const selectLink = () => {
            if (!linkState.currentHyperLinkId) return

            const [match] = Editor.nodes(editor, {
                at: [],
                match: n => (n.type === 'a' && n.id === linkState.currentHyperLinkId),
            })

            const pathToLink = ReactEditor.findPath(editor, match[0])
            const rangeOfLink = Editor.range(editor, pathToLink)

            // Select the current location of the link?????
            Transforms.select(editor, rangeOfLink)
            ReactEditor.focus(editor)
        }

        await selectLink()
        const domSelection = window.getSelection();
        if (!domSelection || domSelection.rangeCount < 1) return;
        const domRange = domSelection!.getRangeAt(0);
        const rect = domRange.getBoundingClientRect();
        el.style.opacity = "1";
        el.style.left = `${rect.left + window.pageXOffset - 1}px`;
        el.style.top = `${rect.bottom + window.pageYOffset + 5}px`;
    }

    useEffect(() => {
        const el = ref.current;

        if (!el) {
            return undefined
        }

        if (!showLinkMenu) {
            setUrl('')
            el.removeAttribute('style');
            return undefined
        }

        if (editor.selection == null) {
            closeMenu();
            return undefined
        }

        document.addEventListener("mousedown", handleClickOutside);
        setSavedSelection(editor.selection);

        // If existing link --> Load up the details
        if (linkState.currentHyperLinkId) {
            setEditing(false)
            setText(linkState.currentText)
            setUrl(linkState.currentLinkUrl)
        } else {
            // We need to grab text of selection because it's highlight + CMD-l.
            setText(Editor.string(editor, editor.selection))
        }

        // ????
        // if (linkState.currentHyperLinkId !== '') {
        //     setUrl(linkState.currentLinkUrl);
        // }

        if (!Range.isCollapsed(editor.selection) && linkState.currentLinkUrl) {
            message.info(`Links on links confuse me. Just click on the link to open it up`)
            return undefined;
        }

        console.log("OPENING LINK MENU")
        openLinkMenu(el).then(() => {
            if (searchInputEl.current) {
                // @ts-ignore
                searchInputEl.current.focus()
            }
        })

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showLinkMenu]);

    /**
     * Close the menu (should we reset selection)
     */
    const closeMenu = (resetDefaultSelection: boolean = true) => {
        setUrl('');
        setText('')
        setDropdownOpen(false)
        setEditing(true)
        dispatch(closeLinkMenu());

        // Reset the selection
        if (resetDefaultSelection && savedSelection) {
            Transforms.select(editor, savedSelection)
            ReactEditor.focus(editor)
        }

        document.removeEventListener("mousedown", handleClickOutside);
    };

    /**
     * Adding a Link
     */
    const addLink = () => {
        if (url === '') {
            clearLink()
        } else {
            const insertedLinkGenerator = upsertLink({
                editor: editor,
                text: text,
                url: url,
                selection: savedSelection!,
                id: linkState.currentHyperLinkId
            });

            if (insertedLinkGenerator) {
                const [...bullshitGenerator] = insertedLinkGenerator
                const newLinkNode: Node = Array.from(bullshitGenerator)[0] as Node

                // Find the Node
                if (newLinkNode) {
                    setTimeout(() => {
                        const thePath = ReactEditor.findPath(editor, newLinkNode)
                        Transforms.select(editor, thePath)
                        Transforms.collapse(editor, {edge: "end"})
                        ReactEditor.focus(editor)
                    }, 100);
                } else {
                    console.log('NO NEW NEW?!??!?')
                }
            }

            closeMenu(false);
        }
    };

    /**
     * Removing a Link:
     *  1. UnWrap the Link
     *  2. Close the Menu
     */
    const clearLink = () => {
        unWrapLink(editor, savedSelection!);
        closeMenu(false);
    };

    const linkMenuContent = (linkId: string) => {
        return (isEditing) ?
            <div className="link-editing-input-container">
                <div className="link-input-container bordered">
                    <AlignLeftOutlined className="link-input-icon"/>
                    <Input
                        allowClear={true}
                        ref={textInputEl}
                        autoFocus={true}
                        className={"link-input"}
                        placeholder={'Text to display'}
                        value={text}
                        onChange={(e) => {
                            setText(e.target.value)
                        }}
                        onPressEnter={(e) => {
                            e.preventDefault()
                            addLink()
                        }}
                    />
                </div>
                <div className="link-input-container">
                    <HierarchySearcherInput
                        isDropdownOpen={isDropdownOpen}
                        setDropdownState={setDropdownOpen}
                        textInputRef={textInputEl}
                        setLinkText={setText}
                        setUrl={setUrl}
                        inputRef={searchInputEl}
                        submitLink={addLink}
                        currentText={text}
                        currentUrl={url}/>
                </div>
            </div> : <DisplayLinkMenu clearLink={clearLink} url={url} setEditing={setEditing}/>
    }

    return (
        <div ref={ref} className={"link-menu-popover"} onKeyDown={closeOnEscapeHandler}>
            {linkMenuContent(linkState.currentHyperLinkId)}
        </div>
    )
};

// const MemoizedLinkMenu = React.memo(LinkMenu, (prevProps: LinkMenuProps, nextProps: LinkMenuProps) => {
//     return (prevProps !== nextProps)
// })

export default LinkMenu

// export default React.memo(LinkMenu)
