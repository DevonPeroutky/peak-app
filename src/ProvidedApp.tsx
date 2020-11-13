import { useDispatch } from "react-redux";
import { openSwitcher } from "./redux/quickSwitcherSlice";
import React, { ReactNode, useEffect } from "react";
import QuickSwitcher from "./common/quick-switcher/QuickSwitcher";
import { HashRouter as Router, Redirect, Route, Switch, useHistory } from "react-router-dom";
import PeakLayout from "./views/layout/PeakLayout";
import { NoMatch } from "./views/not-found/NoMatch";
import { isAuthenticated } from "./redux/userSlice";
import {useCurrentUser, useOnlineStatus} from "./utils/hooks";
import {PeakWelcome} from "./views/welcome/Welcome";
import {LoggedIn} from "./views/logged-in/LoggedIn";
import {PeakOffline} from "./views/offline/Offline";

const ProvidedApp = (props: {}) => {
    const dispatch = useDispatch()
    const keyBindingHandler = (event: any) => {
        if (event.metaKey && event.key == 'k') {
            dispatch(openSwitcher())
        }
    }

    useEffect(() => {
        window.addEventListener("keydown", keyBindingHandler);
        return () => {
            window.removeEventListener("keydown", keyBindingHandler)
        }
    }, [])

    return (
        <div className="App">
            <Router>
                <QuickSwitcher/>
                <Switch>
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