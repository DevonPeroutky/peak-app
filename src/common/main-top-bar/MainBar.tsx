import React, {useState} from 'react'
import {Input, message} from "antd";
import "./main-bar.scss";
import {AppState} from "../../redux";
import {connect} from "react-redux";
import {Peaker} from "../../redux/userSlice";
import GoogleProfileIcon from "../google-profile-icon/GoogleProfileIcon";
import Icon from '@ant-design/icons';
import {SearchOutlined} from "@ant-design/icons/lib";

const MainBar = (props: { user: Peaker }) => {
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
            <GoogleProfileIcon/>
        </div>
    )
};

const mapStateToProps = (state: AppState) => ({ user: state.user});
export default connect(mapStateToProps, {})(MainBar);