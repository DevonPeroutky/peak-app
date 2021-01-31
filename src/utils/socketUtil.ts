import {Channel, Socket} from 'phoenix';
import peakAxiosClient from "../client/axiosConfig";
import {AxiosResponse} from "axios";

interface SocketTokenPayload {
    id: string
    socket_access_token: string
}

export async function fetchAccessTokenForSocket(userId: string): Promise<AxiosResponse<SocketTokenPayload>> {
    return await peakAxiosClient.get<SocketTokenPayload>(`/api/v1/users/${userId}/fetch-socket-access-token`)
}

export function establishSocketConnectionToUsersChannel(userId: string): Promise<Channel> {
    console.log(`!!!!!!!!!!!! Establishing Socket Connection for ${userId}`)
    return fetchAccessTokenForSocket(userId).then(res => {
        const socketAccessToken: SocketTokenPayload = res.data

        // TODO: We should be sending a token
        const socket = new Socket(`ws://localhost:4000/socket`, {
            // logger: ((kind, msg, data) => { console.log(`${kind}: ${msg}`, data) }),
            params: socketAccessToken
        })
        socket.onOpen( ev =>  {
            console.log("Successfully Connected? ", socket.isConnected())
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
    })
}
