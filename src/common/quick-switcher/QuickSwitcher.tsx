import React, {useEffect, useState} from 'react'
import {AutoComplete, Modal } from "antd";
import { useDispatch, useSelector} from "react-redux";
import { AppState} from "../../redux";
import {closeSwitcher, quickSwitcherSlice} from "../../redux/slices/quickSwitcherSlice";
import "./quick-switcher.scss"
import {convertHierarchyToSearchableList} from "../../utils/hierarchy";
import { cloneDeep} from "lodash";
import { useHistory } from 'react-router-dom';
import {renderPeakDisplayNodesInList} from "./quick-switch-item/QuickSwitchItem";
import {PeakDisplayNode, PeakTopicNode} from "../../redux/slices/user/types";
import {useNotes} from "../../client/notes";

const QuickSwitcher = (props: { }) => {
    const hierarchy = useSelector<AppState, PeakTopicNode[]>(state => state.currentUser.hierarchy);
    const isOpen = useSelector<AppState, boolean>(state => state.quickSwitcher.isOpen);
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
        let timer = null;
        if (isOpen) {
            timer = setTimeout(() => {
                setChildOpen(true)
            }, 275);
        }
        return () => {
            clearTimeout(timer!)
        };
    }, [ isOpen ]);

    const closeModal = () => {
        setChildOpen(false)
        setFilteredAntList(antList)

        setTimeout(() => {
            setValue(undefined)
            dispatch(closeSwitcher())
        }, 50);
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
        <Modal
            visible={isOpen}
            maskClosable={true}
            onCancel={closeModal}
            footer={null}
            closable={false}
            keyboard={true}
            destroyOnClose={false}
            className={"quick-switch-modal"}>
             <DropdownThatActuallyListens filteredAntList={filteredAntList} closeModal={closeModal} handleSearch={handleSearch} goTo={goTo} value={value} isOpen={childOpen}/>
        </Modal>
    )
};

const DropdownThatActuallyListens = (props) => {
    const { filteredAntList, closeModal, handleSearch, goTo, value, isOpen } = props
    if (!isOpen) {
        return null
    }
    return (
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
                open={isOpen}
                style={{width: '100%'}}
                value={value}
                dropdownClassName={"peak-dropdown"}
                onSearch={handleSearch}
                onSelect={goTo}
            />
        </div>
    )
}

export default QuickSwitcher
