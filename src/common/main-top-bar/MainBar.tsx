import React, {useState} from 'react'
import {Input, message} from "antd";
import "./main-bar.scss";
import { ProfileDropdown } from "../profile-dropdown/ProfileDropdown";
import {SearchOutlined} from "@ant-design/icons/lib";
import {OfflineAlert} from "../offline-alert/OfflineAlert";

const MainBar = (props: {}) => {
    const [query, setQuery] = useState('');

    const search = () => {
        message.warning("Search not implemented yet!")
    };

    return (
        <div className="main-bar">
            <Input
                className={"minimal-input"}
                placeholder="Search your knowledge..."
                prefix={<SearchOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                onChange={(e) => {
                    setQuery(e.target.value)
                }}
                onPressEnter={search}
            />
            <OfflineAlert/>
            <ProfileDropdown/>
        </div>
    )
};

export default MainBar;