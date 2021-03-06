import React, { useState } from "react";
import { Input } from "antd";
import { AlignLeftOutlined } from "@ant-design/icons/lib";
import HierarchySearcherInput from "../../hierarchy-searcher/HierarchySearcherInput";
import "./editing-link-menu.scss"

export interface LinkEditMenuProps {
    textInputElRef: any
    searchInputElRef: any
    text: string
    setText: (text: string) => void
    url: string
    setUrl: (text: string) => void
    addLink: () => void
}
export const EditingLinkMenu = (props: LinkEditMenuProps) => {
    const { addLink, setUrl, setText, url, text, textInputElRef, searchInputElRef } = props
    const [isDropdownOpen, setDropdownOpen] = useState<boolean>(false)

    return (
        <div className={"editing-link-content-body"}>
            <div className="link-input-container bordered">
                <AlignLeftOutlined className="link-input-icon"/>
                <Input
                    allowClear={true}
                    ref={textInputElRef}
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
                    textInputRef={textInputElRef}
                    setLinkText={setText}
                    setUrl={setUrl}
                    inputRef={searchInputElRef}
                    submitLink={addLink}
                    currentText={text}
                    currentUrl={url}/>
            </div>
        </div>
    )
};
