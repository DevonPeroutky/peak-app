/**
 * This file will automatically be loaded by webpack and run in the "renderer" context.
 * To learn more about the differences between the "main" and the "renderer" context in
 * Electron, visit:
 *
 * https://electronjs.org/docs/tutorial/application-architecture#main-and-renderer-processes
 *
 * By default, Node.js integration in this file is disabled. When enabling Node.js integration
 * in a renderer process, please be aware of potential security implications. You can read
 * more about security risks here:
 *
 * https://electronjs.org/docs/tutorial/security
 *
 * To enable Node.js integration in this file, open up `main.js` and enable the `nodeIntegration`
 * flag:
 *
 * ```
 *  // Create the browser window.
 *  mainWindow = new BrowserWindow({
 *    width: 800,
 *    height: 600,
 *    webPreferences: {
 *      nodeIntegration: true
 *    }
 *  });
 * ```
 */

import { ipcRenderer } from 'electron';
import ReactDOM from "react-dom";
import React from "react";
import App from "./App";
import * as serviceWorker from './serviceWorker';
import './index.scss';
import {Peaker, setUser} from "./redux/userSlice";
import {enterFullscreen, leaveFullscreen, journalHotkeyPressed, setOffline, setOnline} from "./redux/electronSlice";
import {message} from "antd";
import peakAxiosClient from "./client/axiosConfig"
import { store } from "./redux/store"

console.log('👋 This message is being logged by "renderer.js", included via webpack');
ReactDOM.render(<App/>, document.getElementById('root'));

serviceWorker.register();

ipcRenderer.on('login-user', (event, arg) => {
    console.log(`Fetch the user's token via this one-time code: ${arg}`)

    peakAxiosClient.get(`/api/v1/session/load-user-with-oneTimeCode?one-time-code=${arg}`).then((res) => {
        const authedUser = res.data as Peaker
        console.log(authedUser)
        store.dispatch(setUser(authedUser));
        window.location.href = "/main_window#/home/journal"
    }).catch(() => {
        message.error("Error logging you into Peak. Please let Devon know");
    })
})

ipcRenderer.on('fullscreen', (event, arg) => {
    console.log(`Fullscreen? ${arg}`)
    return (arg) ? store.dispatch(enterFullscreen()) : store.dispatch(leaveFullscreen())
})

ipcRenderer.on('go-to-journal', (event, arg) => {
    window.location.href = "/main_window#/home/journal"
    store.dispatch(journalHotkeyPressed())
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
