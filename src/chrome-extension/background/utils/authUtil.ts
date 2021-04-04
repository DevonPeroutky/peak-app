import axios from "axios";
import {ChromeUser} from "../../constants/models";
import {login_via_chrome_extension} from "../../../client/user";
import {Peaker} from "../../../types";
import {setItem} from "../../utils/storageUtils";
import {sendMessageToUser} from "./messageUtil";
import Tab = chrome.tabs.Tab;
import {idempotentlyInjectContentScript} from "./contentUtils";

export function logUserIn(callback: (user: Peaker) => void, retryCounter: number = 0) {
    chrome.identity.getAuthToken({ interactive: true }, function(token) {
        if (chrome.runtime.lastError) {
            console.error("ERROR RETRIEVING THE AUTH TOKEN", chrome.runtime.lastError.message);
            idempotentlyInjectContentScript().then(res =>
                sendMessageToUser(res.tab.id, "error", "Peak Chrome Extension was unable to authenticate with Google", "Tell Devon, the chrome.identity.getAuthToken call failed.")
            )
            return
        }

        axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${token}`).then(r => {
            const chrome_user: ChromeUser = r.data as ChromeUser;
            console.log(`Chrome User: `, chrome_user)

            // TODO: Actually authenticate the User. Anyone could hit this input with a garbase access_token
            login_via_chrome_extension(chrome_user.id)
                .then(r => {
                    const user = r.data as Peaker;
                    console.log(`Successfully logged you into Peak`)
                    setItem("user", user)
                    callback(user)
                }).catch(err => {
                    console.log(`Failed to load user from Backend: ${err.toString()}`)
                    sendErrorMessageToUser("Failed to log you into Peak", "Received an error response from the backend. Tell Devon.")
            })
        }).catch(err => {
            if (retryCounter < 1) {
                chrome.identity.removeCachedAuthToken({ token }, () => logUserIn(callback, 1))
            } else {
                sendErrorMessageToUser("Peak failed to authenticated with Google", "You may not be currently logged into a Google Account. Please do so first")
                console.log(`Failed Google OAuth attempt: ${err.toString()}`)
            }
        });
    });
}

function sendErrorMessageToUser(title: string, context: string) {
    doInCurrentTab((tab) => {
        idempotentlyInjectContentScript().then(_ =>
            sendMessageToUser(
                tab.id,
                "error",
                title,
                context,
                4
                ))
    })
}

function doInCurrentTab(tabCallback: (tab: Tab) => void) {
    chrome.tabs.query(
        { currentWindow: true, active: true },
        function (tabArray) {
            const currTab: Tab | undefined = tabArray[0]
            if (currTab) {
                tabCallback(currTab);
            } else {
                console.log(`Current Tab is undefined`)
            }
        }
    );
}