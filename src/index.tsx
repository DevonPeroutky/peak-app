import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
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
import {buildNoteUrl, fetchNewestNote} from "./utils/notes";

ReactDOM.render(<App />, document.getElementById('root'));

if (isElectron) {
    serviceWorker.register();
    console.log(`Electron context. Attaching listeners onto the renderer.tsx!`)
    const { ipcRenderer } = window.require('electron');

    const journalHash = `#/home/journal`
    const welcomeHash = `#/welcome`
    const offlineHash = `#/offline`
    const tempDesktopLoginHash = `#/temp-desktop-login`

    ipcRenderer.on('login-user', (event, arg) => {
        console.log(`Fetch the user's token via this one-time code: ${arg}`)
        peakAxiosClient.get(`/api/v1/session/load-user-with-oneTimeCode?one-time-code=${arg}`).then((res) => {
            const authedUser = res.data as Peaker
            console.log(authedUser)
            store.dispatch(setUser(authedUser));
            window.location.hash = journalHash
        }).catch(() => {
            message.error("Error logging you into Peak. Please let Devon know");
            window.location.hash = journalHash
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

    ipcRenderer.on('go-to-journal', (event, arg) => {
        console.log(`GOING TO THE JOURNAL`)
        window.location.hash = journalHash
        store.dispatch(journalHotkeyPressed())
    })

    ipcRenderer.on('open-note', (event, arg) => {
        const note = fetchNewestNote()
        window.location.hash = `#${buildNoteUrl(note.id)}`
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
} else {
    // If you want your app to work offline and load faster, you can change
    // unregister() to register() below. Note this comes with some pitfalls.
    // Learn more about service workers: https://bit.ly/CRA-PWA
    serviceWorker.unregister()
}