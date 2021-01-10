import {Drawer, Input, message, Spin} from "antd";
import React, {useEffect, useState} from "react";
import 'antd/lib/modal/style/index.css';
import 'antd/lib/drawer/style/index.css';
import 'antd/lib/divider/style/index.css';
import 'antd/lib/select/style/index.css';
import 'antd/lib/input/style/index.css';
import 'antd/lib/dropdown/style/index.css';
import 'antd/lib/list/style/index.css';
import 'antd/lib/menu/style/index.css';
import 'antd/lib/icon/style/index.css';
import 'antd/lib/tag/style/index.css';
import 'antd/lib/auto-complete/style/index.css';
import 'antd/lib/spin/style/index.css';
// import 'antd/lib/empty/style/css'; This fuck up the styling for everything
import {PeakTag} from "../../../redux/slices/tagSlice";
import "./save-note-modal.scss"
import {SaveNoteEditor} from "./save-note-editor/SaveNoteEditor";
import { TagSelect } from "../../../common/rich-text-editor/plugins/peak-knowledge-plugin/components/peak-knowledge-node/peak-tag-select/component/PeakTagSelect";
import {Editor, Node} from "slate";
import {INITIAL_PAGE_STATE} from "../../../redux/slices/wikiPageSlice";
import {sendSubmitNoteMessage, syncCurrentDrawerState} from "../../content-script/content";
import {CheckOutlined, TagsOutlined} from "@ant-design/icons/lib";
import {PeakLogo} from "../../../common/logo/PeakLogo";
import {SUBMITTING_STATE} from "../../constants/constants";
import {edit} from "ace-builds";

export interface SaveNoteDrawerProps {
    userId: string
    tabId: number
    pageTitle: string
    pageUrl: string
    favIconUrl: string
    tags: PeakTag[]
    nodesToAppend: Node[]
    visible: boolean
    submittingState: SUBMITTING_STATE
    shouldSubmit: boolean
    closeDrawer: () => void
}
export const SaveNoteDrawer = (props: SaveNoteDrawerProps) => {
    const { tabId, userId, tags, closeDrawer, visible, pageTitle, favIconUrl, pageUrl, shouldSubmit, submittingState, nodesToAppend } = props
    const [body, setBody] = useState<Node[]>(INITIAL_PAGE_STATE.body as Node[])
    const [editedPageTitle, setPageTitle] = useState<string>(pageTitle)
    const [selectedTags, setSelectedTags] = useState<PeakTag[]>([])
    const [currentSubmitState, setCurrentSubmitState] = useState<SUBMITTING_STATE>("no")
    // const isEmpty = body.children[0].text === '' && body.node.children.length === 1

    console.log(`PAGE TITLE: ${editedPageTitle} (${pageTitle})`)

    useEffect(() => {
        if (shouldSubmit) {
            console.log(`Submitting!!!`)
            console.log(selectedTags)
            console.log(editedPageTitle)
            setCurrentSubmitState("submitting")
            sendSubmitNoteMessage(tabId, userId, selectedTags, editedPageTitle, pageUrl, favIconUrl, body)
        }
    }, [shouldSubmit])

    useEffect(() => {
        console.log(`SETTING THE PAGE TITLE (${editedPageTitle}) --> (${pageTitle})`)
        setPageTitle(pageTitle)
    }, [pageTitle])

    useEffect(() => {
        setCurrentSubmitState(submittingState)
    }, [submittingState])

    // useEffect(() => {
    //     console.log(`MAybe append BODY?`)
    //     if (nodesToAppend) {
    //         console.log(`Appending nodes to BODY!`)
    //         console.log(nodesToAppend)
    //         console.log(body)
    //         console.log(JSON.stringify(body))
    //         console.log(JSON.stringify(INITIAL_PAGE_STATE.body))
    //         console.log(JSON.stringify(body) === JSON.stringify(INITIAL_PAGE_STATE.body))
    //         const newBody = (JSON.stringify(body) === JSON.stringify(INITIAL_PAGE_STATE.body)) ? nodesToAppend : body.concat(nodesToAppend)
    //         setBody(newBody)
    //     }
    // }, [nodesToAppend])

    const updateThatBody = (newBod: Node[]) => {
        setBody(newBod)
        syncCurrentDrawerState(tabId, userId, selectedTags, editedPageTitle, pageUrl, favIconUrl, newBod)
    }

    return (
        <Drawer
            title={<PageTitle editedPageTitle={editedPageTitle} setPageTitle={setPageTitle} {...props}/>}
            className="peak-note-drawer"
            placement="right"
            closable={false}
            onClose={closeDrawer}
            keyboard={true}
            width={"300px"}
            maskClosable={false}
            mask={false}
            destroyOnClose={true}
            visible={visible || false}
        >
            <>
                <div className="peak-note-drawer-body">
                    <SaveNoteEditor content={body} setContent={updateThatBody}/>
                    <div className="peak-note-drawer-tag-section">
                        <h2 className="peak-note-drawer-header">Tags</h2>
                        <div className="peak-note-tag-section-container">
                            <TagsOutlined/>
                            <TagSelect selected_tags={selectedTags} existing_tags={tags} setSelectedTags={setSelectedTags}/>
                        </div>
                    </div>
                </div>
                <PeakDrawerFooter submittingState={currentSubmitState}/>
            </>
        </Drawer>
    )
}

const PageTitle = (props: {editedPageTitle: string, setPageTitle: (newPageTitle: string) => void, favIconUrl: string, closeDrawer: () => void}) => {
    const { editedPageTitle, setPageTitle, favIconUrl, closeDrawer } = props
    const baseUrl = chrome.runtime.getURL("../../../assets/logos/grayscale-with-sun.svg")

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPageTitle(e.target.value)
    }

    return (
        <div className={"page-peak-note-title-container"}>
            <img className={"page-peak-favicon"} src={favIconUrl || baseUrl}/>
            <Input className={"page-peak-title-input"} bordered={false} value={editedPageTitle} onChange={onChange}/>
            <SkippableCloseIcon closeDrawer={closeDrawer} />
        </div>
    )
}

const SkippableCloseIcon = (props: { closeDrawer: () => void}) => {
    const { closeDrawer }  = props
    const baseUrl = chrome.runtime.getURL("../../../assets/icons/gray-close.svg")
    return (
        <>
            <img className={"peak-close-icon"} src={baseUrl} onClick={closeDrawer}/>
        </>
    )
}

const PeakDrawerFooter = (props: {submittingState: SUBMITTING_STATE}) => {
    const { submittingState } = props

    switch (submittingState) {
        case "submitting":
            return (
                <div className={"peak-note-drawer-footer"}>
                    <span className={"submitting result-span"}><Spin className={"peak-spinner"}/> Saving</span>
                </div>
            )
        case "submitted":
            return (
                <div className={"peak-note-drawer-footer"}>
                    <span className={"success result-span"}><CheckOutlined className={"saved-check"}/> Saved</span>
                </div>
            )
        default:
            return (
                <div className={"peak-note-drawer-footer"}>
                    <PeakLogo/>
                    <span>Press <span className="hotkey-decoration">⌘ + ⇧ + S</span> again to Save</span>
                </div>
            )
    }
}