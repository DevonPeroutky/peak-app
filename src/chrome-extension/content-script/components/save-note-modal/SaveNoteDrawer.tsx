import {Drawer, Input} from "antd";
import React, {useEffect, useMemo, useState} from "react";
// import 'antd/lib/empty/style/css'; This fuck up the styling for everything
// import 'antd/lib/modal/style/index.css';
// import 'antd/lib/drawer/style/index.css';
// import 'antd/lib/divider/style/index.css';
// import 'antd/lib/select/style/index.css';
// import 'antd/lib/input/style/index.css';
// import 'antd/lib/dropdown/style/index.css';
// import 'antd/lib/list/style/index.css';
// import 'antd/lib/menu/style/index.css';
// import 'antd/lib/icon/style/index.css';
// import 'antd/lib/tag/style/index.css';
// import 'antd/lib/auto-complete/style/index.css';
// import 'antd/lib/spin/style/index.css';
import "./save-note-modal.scss"
import {createEditor, Node} from "slate";
import {ReactEditor} from "slate-react";
import {pipe} from "@udecode/slate-plugins";
import {PeakTag} from "../../../../types";
import {SUBMISSION_STATE} from "../../../constants/constants";
import {INITIAL_PAGE_STATE} from "../../../../constants/editor";
import {syncCurrentDrawerState} from "../../utils/messageUtils";
import {chromeExtensionNormalizers} from "../../../../common/rich-text-editor/editors/chrome-extension/config";
import cn from "classnames";
import {SaveNoteEditor} from "./save-note-editor/SaveNoteEditor";
import {TagsOutlined} from "@ant-design/icons/lib";
import {TagSelect} from "../../../../common/rich-text-editor/plugins/peak-knowledge-plugin/components/peak-knowledge-node/peak-tag-select/component/ChromeExtensionTagSelect";
import {PeakLogo} from "../../../../common/logo/PeakLogo";
import {SavingAnimation} from "./saving-animation/SavingAnimation";

export interface SaveNoteDrawerProps {
    userId: string
    tabId: number
    pageTitle: string
    pageUrl: string
    favIconUrl: string
    tags: PeakTag[]
    nodesToAppend: Node[]
    visible: boolean
    submittingState: SUBMISSION_STATE
    shouldSubmit: boolean
    closeDrawer: () => void
}
export const SaveNoteDrawer = (props: SaveNoteDrawerProps) => {
    const { tabId, userId, closeDrawer, visible, pageTitle, favIconUrl, pageUrl, shouldSubmit, submittingState, nodesToAppend } = props
    const [body, setBody] = useState<Node[]>(INITIAL_PAGE_STATE.body as Node[])
    const [editedPageTitle, setPageTitle] = useState<string>(pageTitle)
    const [selectedTags, setSelectedTags] = useState<PeakTag[]>([])

    // @ts-ignore
    const editor: ReactEditor = useMemo(() => pipe(createEditor(), ...chromeExtensionNormalizers), []);

    const isEmpty = () => {
        return JSON.stringify(body) === JSON.stringify(INITIAL_PAGE_STATE.body)
    }

    useEffect(() => {
        if (shouldSubmit) {
            // sendSubmitNoteMessage(tabId, userId, selectedTags, editedPageTitle, pageUrl, favIconUrl, body)
        }
    }, [shouldSubmit])

    useEffect(() => {
        setPageTitle(pageTitle)
    }, [pageTitle])

    useEffect(() => {
        const editorHasFocus: boolean = ReactEditor.isFocused(editor)
        if (nodesToAppend && !editorHasFocus) {
            if (isEmpty()) {
                updateThatBody([{children: nodesToAppend}])
            } else {
                const newBodyChildren: Node[] = (body[0].children as Node[]).concat(nodesToAppend)
                updateThatBody([{children: newBodyChildren}])
            }
        }
    }, [nodesToAppend])

    const updateThatBody = (newBod: Node[]) => {
        setBody(newBod)
        syncCurrentDrawerState(tabId, userId, selectedTags, editedPageTitle, pageUrl, favIconUrl, newBod)
    }

    return (
        <Drawer
            title={<PageTitle editedPageTitle={editedPageTitle} setPageTitle={setPageTitle} {...props}/>}
            className={cn("peak-note-drawer", (submittingState == SUBMISSION_STATE.Saving) ? "submitting" : "")}
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
                {(submittingState == SUBMISSION_STATE.Saved) ?
                    <DrawerContent
                        {...props}
                        body={body}
                        updateThatBody={updateThatBody}
                        editor={editor}
                        selectedTags={selectedTags}
                        setSelectedTags={setSelectedTags}/> :
                    <SavingAnimation submittingState={submittingState} closeDrawer={closeDrawer}/>
                }
            </>
        </Drawer>
    )
}

const DrawerContent = (props) => {
    const { body, updateThatBody, editor, selectedTags, tags, setSelectedTags } = props

    return (
        <div className={"peak-note-drawer-body"}>
            <SaveNoteEditor content={body} setContent={updateThatBody} editor={editor}/>
            <div className="peak-note-drawer-tag-section">
                <h2 className="peak-note-drawer-header">Tags</h2>
                <div className="peak-note-tag-section-container">
                    <TagsOutlined/>
                    <TagSelect selected_tags={selectedTags} existing_tags={tags} setSelectedTags={setSelectedTags}/>
                </div>
            </div>
            <PeakDrawerFooter/>
        </div>
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

const PeakDrawerFooter = (props) => {
    return (
        <div className={"peak-note-drawer-footer"}>
            <PeakLogo/>
            <span>Press <span className="hotkey-decoration">⌘ + ⇧ + S</span> again to Save</span>
        </div>
    )
}