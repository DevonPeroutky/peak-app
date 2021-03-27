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
import {useCurrentUser, useCurrentPage, useOnlineStatus, useCurrentPageId, useIsFullscreen} from "../../utils/hooks";
import {useHistory} from "react-router";
import {PeakWelcome} from "../welcome/Welcome";
import {EditorContextBar} from "../../common/editor-context-bar/EditorContextBar";
import {DndProvider} from "react-dnd";
import {HTML5Backend} from "react-dnd-html5-backend";
import {loadEntireWorldForAllAccounts} from "../../utils/loading-util";
import {useJournalSubscription} from "../../common/rich-text-editor/editors/journal/hooks";
import {establishSocketConnection} from "../../utils/socketUtil";
import {PeakNoteListView} from "../notes/notes-list/NoteListView";
import {PeakNoteView} from "../notes/note-view/NoteView";
import {PeakDraftNoteView} from "../notes/note-view/DraftNoteView";
import {
    ELEMENT_PEAK_BOOK,
    ELEMENT_WEB_NOTE
} from "../../common/rich-text-editor/plugins/peak-knowledge-plugin/constants";
import {isElectron} from "../../utils/environment";
import cn from "classnames"
import {PeakScratchpad} from "../scratchpad/Scratchpad";
const { Content } = Layout;

const PeakLayout = (props: {}) => {
    let match = useRouteMatch();
    const { topic_id } = useParams<{topic_id: string}>();
    const [isLoading, setLoading] = useState(true);
    const currentWikiPage = useCurrentPage();
    const currentUser = useCurrentUser();
    const history = useHistory()
    const isOnline = useOnlineStatus()
    const isFullscreen = useIsFullscreen()

    useJournalSubscription()

    useEffect(() => {
        if (!isOnline) {
            history.push("/offline");
        }
    })

    useEffect(() => {
        establishSocketConnection(currentUser.id)
    }, [])

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

    const loadEverything: () => Promise<void> = () => loadEntireWorldForAllAccounts(currentUser.id, currentUser.peak_user_id)

    if (isLoading) return <Loading isLoadingCallback={setLoading} thePromised={loadEverything}/>
    return (
        <DndProvider backend={HTML5Backend}>
            <Layout className="peak-parent-layout">
                <PeakSidebar/>
                <Content className={cn((isFullscreen || !isElectron) ? "fullscreen" : "not-fullscreen", "peak-main-content")}>
                    <MainBar/>
                    <Content className="peak-content-container">
                        <div className="peak-content-holder">
                            <Switch>
                                <Route path={`${match.path}/journal`} render={(props) => <PeakJournal />} />
                                <Route path={`${match.path}/scratchpad`} render={(props) => <PeakScratchpad />} />
                                <Route path={`${match.path}/draft-book`} render={(props) => <PeakDraftNoteView />} />
                                <Route path={`${match.path}/notes/:id`} render={(props) => {
                                    if (props.match.params && props.match.params.id) {
                                        return <PeakNoteView key={props.match.params.id} {...props} />
                                    } else {
                                        return <Redirect to={"/"} />
                                    }
                                }} />
                                <Route path={`${match.path}/notes`} render={(props) => <PeakNoteListView page_header={"Bookmarks"} note_type={ELEMENT_WEB_NOTE}/>} />
                                <Route path={`${match.path}/books`} render={(props) => <PeakNoteListView page_header={"books"} note_type={ELEMENT_PEAK_BOOK}/>} />
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
                        </div>
                    </Content>
                    <EditorContextBar/>
                </Content>
            </Layout>
        </DndProvider>
    )
};

export default PeakLayout;