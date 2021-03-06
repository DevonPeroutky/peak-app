import React, {ReactNode} from "react";
import QuickSwitcher from "./common/quick-switcher/QuickSwitcher";
import {HashRouter as Router, Redirect, Route, Switch} from "react-router-dom";
import PeakLayout from "./views/layout/PeakLayout";
import {NoMatch} from "./views/not-found/NoMatch";
import {isAuthenticated} from "./redux/slices/user/userSlice";
import {useCurrentUser} from "./utils/hooks";
import {PeakWelcome} from "./views/welcome/Welcome";
import {LoggedIn} from "./views/logged-in/LoggedIn";
import {PeakOffline} from "./views/offline/Offline";
import {PeakTimeline} from "./views/timeline/PeakTimeline";
import {useUserAccounts} from "./utils/requests";
import {DisplayPeaker} from "./redux/slices/userAccountsSlice";
import {KeybindingHandlerWrapper} from "./utils/loading-util";
import {Peaker} from "./types";
import {TempDesktopLogin} from "./views/temp-desktop-login/TempDesktopLogin";
import {useSelector} from "react-redux";
import {AppState} from "./redux";
import cn from "classnames"
import {LOGIN_FLOW} from "./constants/types";

const ProvidedApp = (props: {}) => {
    const userAccounts: DisplayPeaker[] = useUserAccounts()
    const isQuickSwitcherOpen = useSelector<AppState, boolean>(state => state.quickSwitcher.isOpen);
    const user: Peaker = useCurrentUser()

    return (
        <div className={cn("App", (isQuickSwitcherOpen) ? "no-scroll" : "")}>
            <Router>
                <KeybindingHandlerWrapper currentUserId={user.id} userAccounts={userAccounts}/>
                <QuickSwitcher isOpen={isQuickSwitcherOpen}/>
                <Switch>
                    <Route path="/timeline">
                        <PeakTimeline/>
                    </Route>
                    <Route path="/offline">
                        <PeakOffline/>
                    </Route>
                    <Route path="/welcome">
                        <PeakWelcome/>
                    </Route>
                    <Route path="/extension-logged-in">
                        <LoggedIn loginFlow={LOGIN_FLOW.Extension}/>
                    </Route>
                    <Route path="/logged-in">
                        <LoggedIn loginFlow={LOGIN_FLOW.Desktop}/>
                    </Route>
                    <Route path="/temp-desktop-login">
                        <TempDesktopLogin/>
                    </Route>
                    <AuthedRoute>
                        <Switch>
                            <Route path={"/home"} render={(props) => <PeakLayout currentUser={user}/>} />
                            <Route path={"/topic/:topic_id"} render={(props) => <PeakLayout currentUser={user}/>}/>
                            <Route path={"/"} component={PeakLayout}>
                                <Redirect to="/home/scratchpad" />
                            </Route>
                        </Switch>
                    </AuthedRoute>
                    <Route path="*">
                        <NoMatch />
                    </Route>
                </Switch>
            </Router>
        </div>
    );
}

interface IProps {
    children: ReactNode;
    // any other props that come into the component
}
function AuthedRoute({ children, ...rest }: IProps) {
    const user = useCurrentUser()
    return (
        <Route
            {...rest}
            render={({ location }) =>
                isAuthenticated(user) ? (
                    children
                ) : (
                    <Redirect
                        push={true}
                        to={{
                            pathname: "/welcome",
                            state: { from: location }
                        }}
                    />
                )
            }
        />
    );
}

export default ProvidedApp