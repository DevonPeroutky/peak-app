import React, {useEffect, useState} from 'react'
import {AutoComplete } from "antd";
import { useDispatch, useSelector} from "react-redux";
import { AppState} from "../../redux";
import {closeSwitcher} from "../../redux/slices/quickSwitcherSlice";
import "./quick-switcher.scss"
import {convertHierarchyToSearchableList} from "../../utils/hierarchy";
import { cloneDeep} from "lodash";
import { useHistory } from 'react-router-dom';
import {renderPeakDisplayNodesInList} from "./quick-switch-item/QuickSwitchItem";
import {PeakDisplayNode, PeakTopicNode} from "../../redux/slices/user/types";
import {useNotes} from "../../client/notes";
import {PeakModal} from "../peak-modal/PeakModal";

const QuickSwitcher = (props: { isOpen: boolean }) => {
    const { isOpen } = props
    const hierarchy = useSelector<AppState, PeakTopicNode[]>(state => state.currentUser.hierarchy);
    const dispatch = useDispatch()
    const notes = useNotes()
    const history = useHistory()
    const [value, setValue] = useState<string | undefined>(undefined)
    const [childOpen, setChildOpen] = useState<boolean>(false)
    const [antList, setAntList] = useState<PeakDisplayNode[]>([])
    const [filteredAntList, setFilteredAntList] = useState<PeakDisplayNode[]>([])

    useEffect(() => {
        if (hierarchy) {
            const derivedAntList = convertHierarchyToSearchableList(cloneDeep(hierarchy), notes)
            setAntList(derivedAntList)
            setFilteredAntList(derivedAntList)
        }
    }, [ hierarchy, notes ]);

    useEffect(() => {
        setChildOpen(isOpen)
    }, [ isOpen ]);

    const closeModal = () => {
        setChildOpen(false)
        setFilteredAntList(antList)
        setValue(undefined)
        dispatch(closeSwitcher())
    }

    const goTo = async (val: string, option: any) => {
        const peakNode: PeakDisplayNode = option.children.props.node as PeakDisplayNode
        setValue(peakNode.title)
        history.push(peakNode.url)
        closeModal()
    }

    const handleSearch = (query: string) => {
        if (query) {
            const filteredList = antList.filter(n => n.title.toLowerCase().includes(query.toLowerCase()))
            setFilteredAntList(filteredList)
        } else {
            setFilteredAntList(antList)
        }
    }


    return (
        <PeakModal isOpen={isOpen} onClose={() => closeModal()}>
            {
                (!isOpen) ? null :
                <div className={"quick-switch-modal-container"}>
                    <AutoComplete
                    autoFocus
                    children={renderPeakDisplayNodesInList(filteredAntList)}
                    className={"quick-switch-input"}
                    autoClearSearchValue={true}
                    defaultActiveFirstOption={true}
                    showArrow={false}
                    showSearch={false}
                    placeholder="Jump to..."
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault()
                        }
                        if (e.key === 'Escape') {
                            e.preventDefault()
                            closeModal()
                        }
                    }}
                    open={true}
                    style={{width: '100%'}}
                    value={value}
                    dropdownClassName={"peak-dropdown"}
                    onSearch={handleSearch}
                    onSelect={goTo}
                    />
                </div>
            }
        </PeakModal>
    )
};

export default QuickSwitcher
