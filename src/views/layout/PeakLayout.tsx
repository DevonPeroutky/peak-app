import React, {useEffect, useState} from 'react'
import PeakSidebar from "../../common/sidebar/PeakSidebar";
import {Layout} from 'antd';
import 'antd/dist/antd.css';
import "./peak-layout.scss"
import {Route, Switch, useParams, useRouteMatch, Redirect} from "react-router-dom";
import PeakJournal from "../journal/Journal";
import PeakReadingList from "../reading-list/PeakReadingList";
import {PeakTimeline} from "../timeline/PeakTimeline";
import {connect, useDispatch} from "react-redux";
import { Peaker, setUser } from "../../redux/userSlice";
import {setTopics} from "../../redux/topicSlice"
import {Loading} from "../loading/Loading";
import TopicWiki from "../wiki/TopicWiki";
import {setFutureReads} from '../../redux/readingListSlice';
import {addPages, setEditing} from "../../redux/wikiPageSlice";
import axios from "axios";
import {backend_host_address} from "../../constants/constants";
import MainBar from "../../common/main-top-bar/MainBar";
import {useCurrentUser, useCurrentWikiPage, useOnlineStatus} from "../../utils/hooks";
import {useHistory} from "react-router";
import {PeakWelcome} from "../welcome/Welcome";
import {HelpModal} from "../../common/modals/help-modal/HelpModal";
import {Slate} from "slate-react";
import {EditorContextBar} from "../../common/editor-context-bar/EditorContextBar";
const { Content } = Layout;

const PeakLayout = (props: {}) => {
    const user = useCurrentUser()
    let match = useRouteMatch();
    const dispatch = useDispatch();
    const { topic_id } = useParams<{topic_id: string}>();
    const [isLoading, setLoading] = useState(true);
    const currentWikiPage = useCurrentWikiPage();
    const history = useHistory()
    const isOnline = useOnlineStatus()

    useEffect(() => {
        if (!isOnline) {
            history.push("/offline");
        }
    })

    useEffect(() => {
        console.log(`FIRING THIS BAD BOY`)
        const hash = history.location.hash
        if (hash && document.getElementById(hash.substr(1))) {
            // Check if there is a hash and if an element with that id exists
            // @ts-ignore
            document.getElementById(hash.substr(1)).scrollIntoView({behavior: "smooth"})
        } else {
            window.scrollTo(0, 0)
        }
    }, [history.location.hash]) // Fires every time hash changes

    const fetchAllTopics = () => {
        return axios.get(`${backend_host_address}/api/v1/users/${user.id}/topics`)
            .then(res => {
                const topics = res.data.topics;
                dispatch(setTopics(topics));
            }).catch(() => {
                console.log("ERROR")
            });
    };
    const fetchEntireReadingList = () => {
        return axios.get(`${backend_host_address}/api/v1/users/${user.id}/future-reads`)
            .then(res => {
                const readingList = res.data.data
                dispatch(setFutureReads(readingList))
            });
    };
    const fetchPages = () => {
        return axios.get(`${backend_host_address}/api/v1/users/${user.id}/pages`)
            .then(res => {
                const wikiPages = res.data.pages;
                dispatch(addPages(wikiPages))
            });
    };
    const fetchHierarchy = () => {
        return axios.get(`${backend_host_address}/api/v1/users/${user.id}`)
            .then(res => {
                const user = res.data.data;
                dispatch(setUser(user))
            });
    };

    if (isLoading) return <Loading isLoadingCallback={setLoading} thePromised={[fetchAllTopics, fetchEntireReadingList, fetchPages, fetchHierarchy]}/>
    return (
        <Layout className="peak-parent-layout">
            <PeakSidebar/>
            <Content className="peak-main-content">
                <MainBar/>
                <Content className="peak-content-container">
                    <Switch>
                        <Route path={`${match.path}/journal`} render={(props) => <PeakJournal />} />
                        <Route path={`${match.path}/reading-list`} render={(props) => <PeakReadingList {...props} />} />
                        <Route path={`${match.path}/timeline`} render={(props) => <PeakTimeline />} />
                        <Route path={`${match.path}/welcome`} render={(props) => <PeakWelcome />} />
                        <Route path={`${match.path}/wiki/:id`} render={(props) => {
                            if (currentWikiPage) {
                                return <TopicWiki key={props.match.params.id} {...props} topic_id={topic_id}/>
                            } else {
                                return <Redirect to={"/"} />
                            }
                        }}/>
                        <Route path={`${match.path}/`} render={(props) => <PeakJournal/>} />
                        <Route path="*">
                            <h1>NOT FOUND</h1>
                        </Route>
                    </Switch>
                </Content>
                <EditorContextBar/>
            </Content>
        </Layout>
    )
};

export default PeakLayout;