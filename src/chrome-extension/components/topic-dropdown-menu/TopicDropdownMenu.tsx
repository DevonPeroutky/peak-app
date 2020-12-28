import React, {useEffect, useMemo, useRef} from 'react';
import {useState} from "react";
import {Menu} from "antd";
import 'antd/lib/menu/style/index.css';
import useAxios from "axios-hooks";
import {popOffPage} from "../../utils/tabUtils";
import "./topic-dropdown-menu.scss"
const R = require('ramda');

export const TopicDropdownMenu = (props: { userId: string }) => {
    const [topics, setTopics] = useState([]);
    const [{}, fetchTopics] = useAxios(`http://localhost:4000/api/v1/users/${props.userId}/topics`);
    const { userId } = props;

    useEffect(() => {
        fetchTopics()
            .then(res => {
                const topics = res.data.data;
                setTopics(topics);
            })
    }, []);

    const openNextReadingListItem: (topicId: string) => void = R.partial(popOffPage, [userId]);

    const handleSelect = ({ item, key, keyPath, selectedKeys, domEvent }) => {
        openNextReadingListItem(selectedKeys);
    };

    const capitalize = (theString: string) => {
        return theString.split(" ").map(str => `${str[0].toUpperCase() + str.substring(1)}`).join(" ");
    };

    return (
        <Menu onSelect={handleSelect} className={"chrome-ext-topic-dropdown-menu"}>
            <Menu.Item key="random-topic-69">
                Random
            </Menu.Item>
            <Menu.Divider/>
            {topics.map(d => <Menu.Item key={d.id}>{capitalize(d.name)}</Menu.Item>)}
        </Menu>
    );
}