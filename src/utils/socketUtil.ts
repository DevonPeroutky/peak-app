import {Channel, Socket} from 'phoenix';

export function establishSocketConnectionToUsersChannel(userId: string): Channel {
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
    channel.on("end_session", payload => channel.leave())

    return channel
}
