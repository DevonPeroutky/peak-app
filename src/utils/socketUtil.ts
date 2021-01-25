import {Channel, Socket} from 'phoenix';
import {useCurrentUser} from "./hooks";
import {useEffect} from "react";

export function establishSocketConnectionToChannel(userId: string): Channel {
    console.log(`!!!!!!!!!!!! Establishing Socket Connection for ${userId}`)

    // TODO: We should be sending a token
    const socket = new Socket(`ws://localhost:4000/socket`, {
        // logger: ((kind, msg, data) => { console.log(`${kind}: ${msg}`, data) }),
        params: { user_id: userId }
    })

    socket.onOpen( ev =>  {
        console.log("Open ", socket.isConnected())
    })
    socket.onError( ev => console.log("ERROR: ", ev) )
    socket.onClose( e => console.log("CLOSE: ", e))
    socket.connect()


    const channel: Channel = socket.channel(`journal:${userId}`, {});
    channel.join()
        .receive("error", err => console.log("ERROR TRYING TO JOINNNNN", err))
        .receive("timeout", () => console.log("Timeout error"))
        .receive("ok", () => channel.push("test", {"user_id": userId}))

    channel.onClose(() => console.log("Closed for Business"))

    channel.on("web_note_created", res => {
        console.log(`I am ${userId} and I just received a new web note!!!`, res)
    })
    channel.on("end_session", payload => {
        console.log("terminating session")
        channel.leave()
    })

    return channel
}

export const useSockets = () => {
    const user = useCurrentUser()
    const currentUserAccountId = user.id

    let socket: Socket

    useEffect(() => {
        if (!socket) {
            establishSocketConnectionToChannel(currentUserAccountId)
        } else {
            console.log(`Already have a socket for ${currentUserAccountId}`)
        }
    }, [currentUserAccountId]);
}

