import {Channel, Socket} from 'phoenix';
import peakAxiosClient from "../client/axiosConfig";
import {AxiosResponse} from "axios";

interface SocketTokenPayload {
    id: string
    socket_access_token: string
}

export let socket: Socket | undefined = undefined

export async function fetchAccessTokenForSocket(userId: string): Promise<AxiosResponse<SocketTokenPayload>> {
    return await peakAxiosClient.get<SocketTokenPayload>(`/api/v1/users/${userId}/fetch-socket-access-token`)
}

export function establishSocketConnection(userId: string): Promise<Socket> {
    console.log(`!!!!!!!!!!!! Establishing Socket Connection for ${userId}`)
    return fetchAccessTokenForSocket(userId).then(res => {
        const socketAccessToken: SocketTokenPayload = res.data

        // TODO: Needs to be configured as another BACKEND URL
        const socketConn = new Socket(`ws://localhost:4000/socket`, {
            // logger: ((kind, msg, data) => { console.log(`${kind}: ${msg}`, data) }),
            params: socketAccessToken,
        })
        socketConn.onOpen( ev => {
            console.log(`Connected to socket`)
            socket = socketConn
        })
        socketConn.onError( ev => console.log("ERROR: ", ev) )
        socketConn.onClose( e => console.log(`Socket has been closed`))
        socketConn.connect()
        return socketConn
    })
}

export function subscribeToTopic(socket: Socket, topicName: string): Channel {
    const channel: Channel = socket.channel(topicName, {});
    channel.join()
        .receive("error", err => console.log("ERROR TRYING TO JOINNNNN", err))
        .receive("timeout", () => console.log("Timeout error"))
    channel.onClose(() => console.log("Closed for Business"))
    channel.on("end_session", payload => channel.leave())
    return channel
}
