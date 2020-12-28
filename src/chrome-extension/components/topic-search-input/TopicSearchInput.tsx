import React, {useEffect} from 'react';
import {useState} from "react";
import {AutoComplete, Select} from "antd";
import 'antd/lib/auto-complete/style/index.css';
import 'antd/lib/select/style/index.css';
import useAxios from "axios-hooks";
import "./topic-search-input.scss"

const { Option } = Select;
export const TopicSearchInput = (props: {userId: string, onSelection: (topic: string) => void}) => {
    const [topics, setTopics] = useState([]);
    const [filteredTopics, setFilteredTopics] = useState([]);
    const [value, setValue] = useState(undefined);

    const [{}, fetchTopics] = useAxios(`http://localhost:4000/api/v1/users/${props.userId}/topics`);

    useEffect(() => {
        fetchTopics()
            .then(res => {
                const topics = res.data.data;
                setTopics(topics);
                setFilteredTopics(topics);
            })
    }, []);

    const handleSelect = (key, option) => {
        props.onSelection(option.key);
    };

    const capitalize = (theString: string) => {
        return theString.split(" ").map(str => `${str[0].toUpperCase() + str.substring(1)}`).join(" ");
    };

    const options = filteredTopics.map(d => <Option key={d.id} value={d.name}>{capitalize(d.name)}</Option>);
    return (
        <AutoComplete
            autoFocus
            showSearch
            placeholder="Add Specific Topic"
            className="search-input"
            onSelect={handleSelect}
            children={options}
            filterOption={(inputValue, option) =>
                option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
            }
        />
    );
}