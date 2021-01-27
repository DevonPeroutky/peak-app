import axios from "axios";
import {ChromeUser} from "../constants/models";
import {loadUserRequest} from "../../client/user";
import {Peaker} from "../../types";
import {setItemInChromeState} from "./storageUtils";

export function logUserIn(callback: (user: Peaker) => void) {

    chrome.identity.getAuthToken({
        interactive: true
    }, function(token) {
        if (chrome.runtime.lastError) {
            console.error("ERROR RETRIEVING THE AUTH TOKEN", chrome.runtime.lastError.message);
            return;
        }
        console.log(`Logging the user in with the Token: ${token}`)

        axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${token}`).then(r => {
            const chrome_user: ChromeUser = r.data as ChromeUser;
            loadUserRequest(chrome_user.id)
                .then(r => {
                    const user = r.data.data as Peaker;
                    console.log(`Syncing user to chrome storage`, user)
                    setItemInChromeState("user", user)
                    // TODO WATER WE DOING HERE BOYZZZ
                    // if (!channel) {
                    //     channel = establishSocketConnectionToUsersChannel(userId)
                    // }
                    callback(user)
                }).catch(err => console.log(`Failed to load user from Backend: ${err.toString()}`))
        }).catch(err => console.error(`ERRORINGGGGGGG: ${err.toString()}`));
    });
}