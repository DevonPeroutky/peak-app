import React, {useEffect, useState} from 'react'
import PeakSidebar from "../../common/sidebar/PeakSidebar";
import {Layout} from 'antd';
import 'antd/dist/antd.css';
import "./peak-layout.scss"
import {Route, Switch, useParams, useRouteMatch, Redirect} from "react-router-dom";
import PeakJournal from "../journal/Journal";
import PeakReadingList from "../reading-list/PeakReadingList";
import {PeakTimeline} from "../timeline/PeakTimeline";
import {Loading} from "../loading/Loading";
import TopicWiki from "../wiki/TopicWiki";
import MainBar from "../../common/main-top-bar/MainBar";
import {useCurrentUser, useCurrentWikiPage, useOnlineStatus} from "../../utils/hooks";
import {useHistory} from "react-router";
import {PeakWelcome} from "../welcome/Welcome";
import {EditorContextBar} from "../../common/editor-context-bar/EditorContextBar";
import {DndProvider} from "react-dnd";
import {HTML5Backend} from "react-dnd-html5-backend";
import {loadEntireWorldForAllAccounts} from "../../utils/loading-util";
import {establishSocketConnection, useSockets} from "../../utils/socketUtil";
const { Content } = Layout;

const PeakLayout = (props: {}) => {
    let match = useRouteMatch();
    const { topic_id } = useParams<{topic_id: string}>();
    const [isLoading, setLoading] = useState(true);
    const currentWikiPage = useCurrentWikiPage();
    const currentUser = useCurrentUser();
    const history = useHistory()
    const isOnline = useOnlineStatus()
    // establishSocketConnection(currentUser.id)
    useSockets()

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

    useEffect(() => {

    })

    const loadEverything: () => Promise<void> = () => loadEntireWorldForAllAccounts(currentUser.id, currentUser.peak_user_id)

    if (isLoading) return <Loading isLoadingCallback={setLoading} thePromised={loadEverything}/>
    return (
        <DndProvider backend={HTML5Backend}>
            <Layout className="peak-parent-layout">
                <PeakSidebar/>
                <Content className="peak-main-content">
                    <MainBar/>
                    <Content className="peak-content-container">
                       <Switch>
                           <Route path={`${match.path}/journal`} render={(props) => <PeakJournal />} />
                           <Route path={`${match.path}/reading-list`} render={(props) => <PeakReadingList />} />
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
        </DndProvider>
    )
};

export default PeakLayout;