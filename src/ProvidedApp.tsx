import { useDispatch } from "react-redux";
import { openSwitcher } from "./redux/quickSwitcherSlice";
import React, { ReactNode, useEffect } from "react";
import QuickSwitcher from "./common/quick-switcher/QuickSwitcher";
import { HashRouter as Router, Redirect, Route, Switch, useHistory } from "react-router-dom";
import PeakLayout from "./views/layout/PeakLayout";
import { NoMatch } from "./views/not-found/NoMatch";
import {isAuthenticated, Peaker} from "./redux/userSlice";
import {useCurrentUser, useOnlineStatus} from "./utils/hooks";
import {PeakWelcome} from "./views/welcome/Welcome";
import {LoggedIn} from "./views/logged-in/LoggedIn";
import {PeakOffline} from "./views/offline/Offline";
import {PeakTitle} from "./common/rich-text-editor/plugins/peak-title-plugin/peak-title/PeakTitle";
import {PeakTimeline} from "./views/timeline/PeakTimeline";
import {useUserAccounts} from "./utils/requests";
import {DisplayPeaker} from "./redux/userAccountsSlice";
import {syncCurrentStateToLocalStorage} from "./redux/localStoreSync";
import {switch_user_accounts} from "./redux/store";
import {KeybindingHandlerWrapper, useAccountSwitcher} from "./utils/loading-util";

const ProvidedApp = (props: {}) => {
    // const dispatch = useDispatch()
    const userAccounts: DisplayPeaker[] = useUserAccounts()
    const user: Peaker = useCurrentUser()
    // const userFetcher: () => Peaker = useFetchCurrentUser()
    // const switchAccounts = useAccountSwitcher()
    // const keyBindingHandler = (event: KeyboardEvent) => {
    //     if (event.metaKey && event.key == 'k') {
    //         dispatch(openSwitcher())
    //     }
    //
    //     // Hotkey Switcher for accounts
    //     if (event.metaKey && !event.shiftKey && isFinite(+event.key)) {
    //         const numberPressed: number = +event.key
    //         console.log(`---------------------`)
    //         console.log(`Number PRessed: ${numberPressed}`)
    //         console.log(`CURRENT USER: ${user.email}`)
    //         console.log(`FUCKIN BITCH: ${user.email}`)
    //         const thisBITCH = userFetcher()
    //         console.log(userAccounts)
    //         console.log(userAccounts[numberPressed])
    //         if (numberPressed < userAccounts.length && numberPressed >= 0 && userAccounts[numberPressed].id !== user.id) {
    //             event.preventDefault()
    //             const destUserAccount: DisplayPeaker = userAccounts[numberPressed]
    //             console.log(`REALLY DOING IT`)
    //             console.log(destUserAccount)
    //             switchAccounts(destUserAccount)
    //         }
    //     }
    // }
    //
    // useEffect( () => {
    //     console.log(`-----> CURRENT USER AS OF RIGHT NOW: ${user.email}`)
    //     window.addEventListener("keydown", keyBindingHandler);
    //     return () => {
    //         window.removeEventListener("keydown", keyBindingHandler)
    //     }
    // }, [])

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