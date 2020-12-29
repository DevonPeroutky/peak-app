import React, { ReactNode, useEffect } from "react";
import QuickSwitcher from "./common/quick-switcher/QuickSwitcher";
import { HashRouter as Router, Redirect, Route, Switch, useHistory } from "react-router-dom";
import PeakLayout from "./views/layout/PeakLayout";
import { NoMatch } from "./views/not-found/NoMatch";
import {isAuthenticated, Peaker} from "./redux/slices/userSlice";
import {useCurrentUser} from "./utils/hooks";
import {PeakWelcome} from "./views/welcome/Welcome";
import {LoggedIn} from "./views/logged-in/LoggedIn";
import {PeakOffline} from "./views/offline/Offline";
import {PeakTimeline} from "./views/timeline/PeakTimeline";
import {useUserAccounts} from "./utils/requests";
import {DisplayPeaker} from "./redux/slices/userAccountsSlice";
import {KeybindingHandlerWrapper} from "./utils/loading-util";

const ProvidedApp = (props: {}) => {
    const userAccounts: DisplayPeaker[] = useUserAccounts()
    const user: Peaker = useCurrentUser()

    return (
        <div className="App">
            <KeybindingHandlerWrapper currentUserId={user.id} userAccounts={userAccounts}/>
            <Router>
                <QuickSwitcher/>
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
                    <Route path="/logged-in">
                        <LoggedIn/>
                    </Route>
                    <AuthedRoute>
                        <Switch>
                            <Route path={"/home"} component={PeakLayout}/>
                            <Route path={"/topic/:topic_id"} component={PeakLayout}/>
                            <Route path={"/"} component={PeakLayout}>
                                <Redirect to="/home/journal" />
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