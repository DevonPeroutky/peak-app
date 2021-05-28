import React, {useCallback, useEffect, useState} from 'react'
import PeakSidebar from "../../common/sidebar/PeakSidebar";
import {Layout} from 'antd';
import 'antd/dist/antd.css';
import "./peak-layout.scss"
import {Redirect, Route, Switch, useParams, useRouteMatch} from "react-router-dom";
import PeakReadingList from "../reading-list/PeakReadingList";
import {PeakTimeline} from "../timeline/PeakTimeline";
import {useAppLoadingAnimation} from "../loading/Loading";
import TopicWiki from "../wiki/TopicWiki";
import {useCurrentPage, useIsFullscreen, useOnlineStatus} from "../../utils/hooks";
import {useHistory} from "react-router";
import {PeakWelcome} from "../welcome/Welcome";
import {EditorContextBar} from "../../common/editor-context-bar/EditorContextBar";
import {DndProvider} from "react-dnd";
import {HTML5Backend} from "react-dnd-html5-backend";
import {loadEntireWorldForAllAccounts} from "../../utils/loading-util";
import {establishSocketConnection, socket, subscribeToUserNoteChannel} from "../../utils/socketUtil";
import {PeakBookListView} from "../notes/notes-list/NoteListView";
import {PeakNoteView} from "../notes/note-view/NoteView";
import {DraftLearningNoteView, PeakDraftNoteView} from "../notes/note-view/DraftNoteView";
import { ELEMENT_PEAK_BOOK } from "../../common/rich-text-editor/plugins/peak-knowledge-plugin/constants";
import {isElectron} from "../../utils/environment";
import cn from "classnames"
import {PeakScratchpad} from "../scratchpad/Scratchpad";
import {Peaker} from "../../types";
import {Plugins} from "../scratchpad/playground/Playground";
import {BlogHome} from "../blog/BlogHome";
import {BlogSetup} from "../blog/setup/BlogSetup";
import {BlogSettings} from "../blog/settings/BlogConfiguration";
import {BlogCreateSuccess} from "../blog/setup/result/BlogSuccess";

const { Content } = Layout;

const PeakLayout = (props: { currentUser: Peaker }) => {
    const { currentUser } = props
    let match = useRouteMatch();
    const { topic_id } = useParams<{topic_id: string}>();

    // Loading state and animation!
    const { isLoading, renderLoadingAnimation } = useAppLoadingAnimation()

    const currentWikiPage = useCurrentPage();
    const history = useHistory()
    const isOnline = useOnlineStatus()
    const isFullscreen = useIsFullscreen()

    // Subscribe to user channel if we switch users.
    useEffect(() => {
        subscribeToUserNoteChannel(currentUser.id)
    }, [currentUser, socket])

    // Redirect if offline
    useEffect(() => {
        if (!isOnline) {
            history.push("/offline");
        }
    })

    // Establish Socket Connection on first (and only first) render
    useEffect(() => {
        establishSocketConnection(currentUser.id)
    }, [])

    // Fires every time hash changes
    useEffect(() => {
        const hash = history.location.hash
        if (hash && document.getElementById(hash.substr(1))) {
            // Check if there is a hash and if an element with that id exists
            // @ts-ignore
            document.getElementById(hash.substr(1)).scrollIntoView({behavior: "smooth"})
        } else {
            window.scrollTo(0, 0)
        }
    }, [history.location.hash])

    // LoadEverything callback
    const loadEverything = useCallback(() => {
        return loadEntireWorldForAllAccounts(currentUser.id, currentUser.peak_user_id)
    }, [currentUser])

    if (isLoading) {
        return renderLoadingAnimation(loadEverything)
    }
    return (
        <DndProvider backend={HTML5Backend}>
            <Layout className="peak-parent-layout">
                <PeakSidebar/>
                <Content className={cn((isFullscreen || !isElectron) ? "fullscreen" : "not-fullscreen", "peak-main-content")}>
                    <Content className="peak-content-container">
                        <div className="peak-content-holder">
                            <Switch>
                                {/* DELETE THIS NEXT LINE */}
                                <Route path={`${match.path}/blog/setup/success`} render={(props) => <BlogCreateSuccess/>} />
                                <Route path={`${match.path}/blog/setup`} render={(props) => <BlogSetup />} />
                                <Route path={`${match.path}/blog`} render={(props) => <BlogHome />} />
                                <Route path={`${match.path}/playground`} render={(props) => <Plugins />} />
                                <Route path={`${match.path}/scratchpad`} render={(props) => <PeakScratchpad />} />
                                <Route path={`${match.path}/draft-note`} render={(props) => <DraftLearningNoteView />} />
                                <Route path={`${match.path}/draft-book`} render={(props) => <PeakDraftNoteView />} />
                                <Route path={`${match.path}/notes/:id`} render={(props) => {
                                    if (props.match.params && props.match.params.id) {
                                        return <PeakNoteView key={props.match.params.id} {...props} />
                                    } else {
                                        return <Redirect to={"/"} />
                                    }
                                }} />
                                <Route path={`${match.path}/notes`} render={(props) => <PeakTimeline/>} />
                                <Route path={`${match.path}/books`} render={(props) => <PeakBookListView page_header={"books"} note_type={ELEMENT_PEAK_BOOK}/>} />
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
                                <Route path={`${match.path}/`} render={(props) => <PeakScratchpad/>} />
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