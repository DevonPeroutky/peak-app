import * as React from "react";
import {PeakLogo} from "../../../../../../common/logo/PeakLogo";
import "./saved-page-content.scss"
import {LoadingOutlined} from "@ant-design/icons/lib";
import {Spin} from "antd";

export const SavePageHeaderContent = (props: { saving: boolean }) => {
    const { saving } = props
    return (
        <div className={"peak-message-header"}>
            {saving ? <SavingLoader/> : <PeakLogo className={"peak-message-header-logo"}/> }
            <h3>{(saving) ? `Saving...` : `Saved!`}</h3>
        </div>
    )
}

export const SavingLoader = (props) => {
    const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
    return (
        <Spin className={"peak-message-header-logo"} indicator={antIcon} />
    )
}
