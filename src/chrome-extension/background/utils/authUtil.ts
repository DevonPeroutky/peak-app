import axios from "axios";
import {ChromeUser} from "../../constants/models";
import {loadUserRequest, login_via_chrome_extension} from "../../../client/user";
import {Peaker} from "../../../types";
import {setItem} from "../../utils/storageUtils";
import {sendMessageToUser} from "./messageUtil";
import Tab = chrome.tabs.Tab;

export function logUserIn(callback: (user: Peaker) => void) {
    chrome.identity.getAuthToken({
        interactive: true
    }, function(token) {
        if (chrome.runtime.lastError) {
            console.error("ERROR RETRIEVING THE AUTH TOKEN", chrome.runtime.lastError.message);
            return;
        }

        console.log(`Logging the user in with the Token: ${token}`)

        // TODO: Actually authenticate the User. Anyone could hit this input with a garbase access_token
        axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${token}`).then(r => {
            const chrome_user: ChromeUser = r.data as ChromeUser;
            login_via_chrome_extension(chrome_user.id)
                .then(r => {
                    const user = r.data as Peaker;
                    console.log(`Syncing user to chrome storage`, user)
                    setItem("user", user)
                    // TODO WATER WE DOING HERE BOYZZZ
                    // if (!channel) {
                    //     channel = establishSocketConnectionToUsersChannel(userId)
                    // }
                    callback(user)
                }).catch(err => {
                doInCurrentTab((tab) => {
                    sendMessageToUser(tab.id, "error", "Failed to save your bookmark", "Server timed out. Tell Devon.")
                })
                console.log(`Failed to load user from Backend: ${err.toString()}`)
            })
        }).catch(err => console.error(`ERRORINGGGGGGG: ${err.toString()}`));
    });
}

function doInCurrentTab(tabCallback: (tab: Tab) => void) {
    chrome.tabs.query(
        { currentWindow: true, active: true },
        function (tabArray) {
            const currTab: Tab | undefined = tabArray[0]
            if (currTab) {
                console.log(`Current TabId `, currTab)
                tabCallback(currTab);
            } else {
                console.log(`Current Tab is undefined`)
            }
        }
    );
}