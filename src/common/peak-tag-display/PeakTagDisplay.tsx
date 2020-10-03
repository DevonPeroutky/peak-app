import React from 'react'
import {Tag} from "antd";
import {AppState} from "../../redux";
import {connect} from "react-redux";
import {PeakTopic} from "../../redux/topicSlice";
import { capitalize } from "lodash";
const logo = require('../../assets/images/logo/trans-peak.svg');

const PeakTagDisplay = (props: { topicId: string, topics: PeakTopic[] }) => {
    const { topicId, topics } = props;
    const topic = topics.find(topic => topic.id ==topicId);

    if (topic == null) return null;
    return (
        <Tag color={topic.color} key={topicId}>{capitalize(topic.name)}</Tag>
    )
};

const mapStateToProps = (state: AppState) => ({ topics: state.topics});
export default connect(mapStateToProps, {})(PeakTagDisplay);