import * as React from "react";
import {PeakLogo} from "../../../../../../common/logo/PeakLogo";
import "./saved-page-content.scss"
import {LoadingOutlined} from "@ant-design/icons/lib";
import {Spin} from "antd";
import {EDITING_STATE, SUBMISSION_STATE} from "../../../../../constants/constants";

export const SavePageHeaderContent = (props: { saving: SUBMISSION_STATE, editing: EDITING_STATE}) => {
    const { saving, editing } = props
    return (
        <div className={"peak-message-header"}>
            {(saving === SUBMISSION_STATE.Saving && editing !== EDITING_STATE.Editing)  ? <SavingLoader/> : <PeakLogo className={"peak-message-header-logo"}/> }
            <HeaderText {...props}/>
        </div>
    )
}

export const SavingLoader = (props) => {
    const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
    return (
        <Spin className={"peak-message-header-logo"} indicator={antIcon} />
    )
}

const HeaderText = ({ editing, saving }) => {
    if (editing === EDITING_STATE.Editing) {
       return (<h3>Add your notes!</h3>)
    }

    return (<h3>{(saving === SUBMISSION_STATE.Saving) ? `Saving...` : `Saved!`}</h3>)
}
