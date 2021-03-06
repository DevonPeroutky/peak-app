import React, {useEffect, useState} from 'react'
import {AutoComplete, Modal } from "antd";
import { useDispatch, useSelector} from "react-redux";
import { AppState} from "../../redux";
import { closeSwitcher } from "../../redux/slices/quickSwitcherSlice";
import "./quick-switcher.scss"
import {convertHierarchyToSearchableList} from "../../utils/hierarchy";
import { cloneDeep} from "lodash";
import { useHistory } from 'react-router-dom';
import {renderPeakDisplayNodesInList} from "./quick-switch-item/QuickSwitchItem";
import {PeakDisplayNode, PeakTopicNode} from "../../redux/slices/user/types";

const QuickSwitcher = (props: { }) => {
    const hierarchy = useSelector<AppState, PeakTopicNode[]>(state => state.currentUser.hierarchy);
    const isOpen = useSelector<AppState, boolean>(state => state.quickSwitcher.isOpen);
    const dispatch = useDispatch()
    const history = useHistory()
    const [value, setValue] = useState<string | undefined>(undefined)
    const [mounted, setMounted] = useState<boolean>(false)
    const [antList, setAntList] = useState<PeakDisplayNode[]>([])
    const [filteredAntList, setFilteredAntList] = useState<PeakDisplayNode[]>([])

    useEffect(() => {
        console.log(`USING THe QUICKSWITCHER HIERARCHY USEEFFECT`)
        if (hierarchy) {
            const derivedAntList = convertHierarchyToSearchableList(cloneDeep(hierarchy))
            setAntList(derivedAntList)
            setFilteredAntList(derivedAntList)
        }
    }, [ hierarchy ]);

    useEffect(() => {
        let timer = null;
        if (isOpen) {
            timer = setTimeout(() => {
                setMounted(true)
            }, 290);
        }
        return () => {
            clearTimeout(timer!)
        };
    }, [ isOpen ]);

    const closeModal = () => {
        setMounted(false)

        setTimeout(() => {
            setFilteredAntList(antList)
            dispatch(closeSwitcher())
            setValue(undefined)
        }, 200);
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
            destroyOnClose={true}
            className={"quick-switch-modal"}>
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
                        }}
                        open={mounted}
                        style={{width: '100%'}}
                        value={value}
                        dropdownClassName={"peak-dropdown"}
                        onSearch={handleSearch}
                        onSelect={goTo}
                    />
                </div>
        </Modal>
    )
};

export default QuickSwitcher
