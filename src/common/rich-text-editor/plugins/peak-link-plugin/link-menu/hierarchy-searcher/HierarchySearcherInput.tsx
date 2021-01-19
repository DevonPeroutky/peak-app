import React, {useEffect, useState} from 'react'
import {AutoComplete, Input, Modal} from "antd";
import { useSelector} from "react-redux";
import { AppState} from "../../../../../../redux";
import {PeakDisplayNode, PeakTopicNode} from "../../../../../../redux/slices/user/userSlice";
import {convertHierarchyToSearchableList} from "../../../../../../utils/hierarchy";
import { cloneDeep} from "lodash";
import {renderPeakDisplayNodesInList} from "../../../../../quick-switcher/quick-switch-item/QuickSwitchItem";
import "./hierarchy-searcher-input.scss"

interface HierarchySearcherInputProps {
    textInputRef: any
    setLinkText: (newText: string) => void
    setUrl: (newUrl: string) => void
    inputRef: any
    currentText: string | undefined
    currentUrl: string | undefined
    submitLink: () => void
    isDropdownOpen: boolean
    setDropdownState: (newState: boolean) => void
}
const HierarchySearcherInput = (props: HierarchySearcherInputProps) => {
    const { setLinkText, setUrl, inputRef, currentUrl, textInputRef, isDropdownOpen, setDropdownState, currentText } = props
    const hierarchy = useSelector<AppState, PeakTopicNode[]>(state => state.currentUser.hierarchy);
    const [antList, setAntList] = useState<PeakDisplayNode[]>([])
    const [filteredAntList, setFilteredAntList] = useState<PeakDisplayNode[]>([])

    useEffect(() => {
        // console.log(`USING THE LINK MENU useEFFECT`)
        if (hierarchy) {
            const derivedAntList = convertHierarchyToSearchableList(cloneDeep(hierarchy))
            setAntList(derivedAntList)
            setFilteredAntList(derivedAntList)
        }
    }, [hierarchy]);

    const selectPageAsLink = (val: string, option: any) => {
        const peakNode: PeakDisplayNode = option.children.props.node as PeakDisplayNode
        if (!currentText) {
            setLinkText(peakNode.title)
        }
        setUrl(peakNode.url)
        setDropdownState(false)
    }

    const handleSearch = (query: string) => {
        setDropdownState(true)
        if (query) {
            const filteredList = antList.filter(n => n.title.toLowerCase().includes(query.toLowerCase()))
            setFilteredAntList(filteredList)
        } else {
            setFilteredAntList(antList)
        }
    }

    return (
        <AutoComplete
            autoFocus
            ref={inputRef}
            onChange={(value) => {
                setUrl(value)
                setDropdownState(false)
            }}
            children={renderPeakDisplayNodesInList(filteredAntList)}
            className={"hierarchy-searcher-input"}
            autoClearSearchValue={true}
            defaultActiveFirstOption={true}
            showSearch={true}
            showArrow={false}
            onKeyDown={(e) => {
                if (e.key === "Enter") {
                    textInputRef.current.focus()
                }
            }}
            dropdownClassName={"hierarchy-search-dropdown"}
            open={isDropdownOpen}
            value={currentUrl}
            placeholder="Paste a link, or search"
            style={{width: '100%'}}
            onSearch={handleSearch}
            onSelect={selectPageAsLink}
        />
    )
};

export default HierarchySearcherInput
