import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import './constants/utilities.scss';
import App from './App';
import * as serviceWorker from './serviceWorker';
import {isElectron} from "./utils/environment";
import peakAxiosClient from "./client/axiosConfig";
import {Peaker} from "./types";
import {store} from "./redux/store";
import {setUser} from "./redux/slices/user/userSlice";
import {message} from "antd";
import {
    enterFullscreen,
    journalHotkeyPressed,
    leaveFullscreen,
    setOffline,
    setOnline
} from "./redux/slices/electronSlice";
import {buildNoteUrl, newestNodeAcrossAllAcounts, waitForNoteToBeAdded} from "./utils/notes";
import {currentUserInRedux, getUserAccount} from "./redux/utils";
import {DisplayPeaker} from "./redux/slices/userAccountsSlice";
import {switchAccountsOutsideOfRouter} from "./utils/account";
import {RELOAD_REASON} from "./views/intermediate-loading-animation/types";

ReactDOM.render(<App />, document.getElementById('root'));

if (isElectron) {
    serviceWorker.register();
    const { ipcRenderer } = window.require('electron');

    const journalHash = `#/home/journal`
    const recoverHash = `#/home/scratchpad?reload-reason=${RELOAD_REASON.recover}`
    const scratchpadHash = `#/home/scratchpad`
    const welcomeHash = `#/welcome`
    const offlineHash = `#/offline`
    const tempDesktopLoginHash = `#/temp-desktop-login`

    ipcRenderer.on('login-user', (event, arg) => {
        console.log(`Fetch the user's token via this one-time code: ${arg}`)
        peakAxiosClient.get(`/api/v1/session/load-user-with-oneTimeCode?one-time-code=${arg}`).then((res) => {
            const authedUser = res.data as Peaker
            console.log(authedUser)
            store.dispatch(setUser(authedUser));
            window.location.hash = scratchpadHash
        }).catch(() => {
            message.error("Error logging you into Peak. Please let Devon know");
            window.location.hash = scratchpadHash
        })
    })

    ipcRenderer.on('add-user', (event, arg) => {
        console.log(`Adding another user flow???`)
        window.location.hash = tempDesktopLoginHash
    })

    ipcRenderer.on('fullscreen', (event, arg) => {
        console.log(`Fullscreen? ${arg}`)
        return (arg) ? store.dispatch(enterFullscreen()) : store.dispatch(leaveFullscreen())
    })

    ipcRenderer.on('go-to-scratchpad', (event, arg) => {
        console.log(`GOING TO Home`)
        window.location.hash = scratchpadHash
        store.dispatch(journalHotkeyPressed())
    })

    ipcRenderer.on('open-note', (event, arg) => {
        newestNodeAcrossAllAcounts().then(note => {
            const currentUser: Peaker = currentUserInRedux()
            console.log(`NAVIGATE TO NOTE `, note)
            store.getState()
            if (!note) {
                console.warn(`Did not find any notes?`)
                return
            }

            if (note.user_id === currentUser.id) {
                window.location.hash = `#${buildNoteUrl(note.id)}`
            } else  {
                const desiredPeakAccount: DisplayPeaker = getUserAccount(note.user_id)
                if (desiredPeakAccount) {
                    switchAccountsOutsideOfRouter(currentUser.id, desiredPeakAccount, () => {
                        waitForNoteToBeAdded(note).then(_ => {
                            window.location.hash = `#${buildNoteUrl(note.id)}`
                        })
                    })
                } else {
                    console.error(`Failed to find a Peak Account w/id: ${note.user_id}`)
                }
            }
        })
    })

    ipcRenderer.on(`recover`, (event, arg) => {
        console.log(`RECOVERING`)
        window.location.hash = recoverHash
    })

    // -----------------------------
    // Update Online/Offline Status
    // -----------------------------
    const updateOnlineStatus = () => {
        // ipcRenderer.send('online-status-changed', navigator.onLine ? 'online' : 'offline')
        // const status = navigator.onLine ? 'online' : 'offline';
        if (navigator.onLine) {
            store.dispatch(setOnline())
        } else {
            store.dispatch(setOffline())
        }
    }

    window.addEventListener('online', updateOnlineStatus)
    window.addEventListener('offline', updateOnlineStatus)

    updateOnlineStatus()

    // Catch all uncaught error and reset to Journal
    window.onerror = function(error, url, line) {
        console.log(`JUST CAUGHT AN ERROR `, error)
        ipcRenderer.send('uncaughtException', error)
    };
} else {
    // If you want your app to work offline and load faster, you can change
    // unregister() to register() below. Note this comes with some pitfalls.
    // Learn more about service workers: https://bit.ly/CRA-PWA
    serviceWorker.unregister()
}