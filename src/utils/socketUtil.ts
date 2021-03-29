import {Channel, Socket} from 'phoenix';
import peakAxiosClient from "../client/axiosConfig";
import {AxiosResponse} from "axios";
import config from "../constants/environment-vars"
import {PeakWikiPage} from "../constants/wiki-types";
import {JOURNAL_CHANNEL_ID} from "../common/rich-text-editor/editors/journal/constants";
import {store} from "../redux/store";
import {deleteNote, PeakNote, upsertNote} from "../redux/slices/noteSlice";
import {PeakTag} from "../types";
import {batch} from "react-redux";
import {addTags} from "../redux/slices/tags/tagSlice";

interface SocketTokenPayload {
    id: string
    socket_access_token: string
}

export interface ChannelMap {
    [userId: string]: Channel;
}
export let socket: Socket | undefined = undefined
export let channels: ChannelMap = {}

function subscribeToTopic(socket: Socket, topicName: string): Channel {
    const existingChannel = getUserNoteChannel(topicName)

    if (existingChannel) {
        console.log(`Channel ${topicName} already exists`)
        return existingChannel
    } else {
        const channel: Channel = socket.channel(topicName, {});
        channel.join()
            .receive("error", err => console.log("ERROR TRYING TO JOINNNNN", err))
            .receive("timeout", () => console.log("Timeout error"))
        channel.onClose((payload, ref, joinRef) => {
            console.log("Closed for Business, ", payload)
        })
        channel.on("end_session", payload => {
            console.log(`end_session happened???? `, payload)
            channel.leave()
        })
        channels[topicName] = channel
        return channel
    }
}

function getUserNoteChannel(channelId: string): Channel | undefined {
    return channels[channelId]
}

function fetchAccessTokenForSocket(userId: string): Promise<AxiosResponse<SocketTokenPayload>> {
    return peakAxiosClient.get<SocketTokenPayload>(`/api/v1/users/${userId}/fetch-socket-access-token`)
}

// TODO: Check if socket already exists?
export function establishSocketConnection(userId: string): Promise<Socket> {
    return fetchAccessTokenForSocket(userId).then(res => {
        const socketAccessToken: SocketTokenPayload = res.data

        const socketUrl = `${config.web_socket_protocol}://${config.backend_domain}/socket`
        console.log(`Connecting to ${socketUrl}`)
        const socketConn = new Socket(socketUrl, {
            // logger: ((kind, msg, data) => { console.log(`${kind}: ${msg}`, data) }),
            params: socketAccessToken,
        })
        socketConn.onOpen( ev => {
            socket = socketConn
        })
        socketConn.onError( ev => console.log("ERROR: ", ev) )
        socketConn.onClose( e => console.log(`Socket has been closed`))
        socketConn.connect()
        return socketConn
    })
}

export const closeUserNoteChannel = (userId: string) => {
    const userChannel = socket.channel(`journal:${userId}`)
    userChannel.leave().receive("ok", () => console.log(`${userId} has left!`))
}

export const subscribeToUserNoteChannel = (userId: string) => {
    if (socket) {
        const channel = subscribeToTopic(socket, JOURNAL_CHANNEL_ID(userId))

        channel.on("delete_bookmark", res => {
            const noteIdToDelete: string = res.noteId
            store.dispatch(deleteNote(noteIdToDelete))
        })

        channel.on("test", res => {
            console.log(`WE RECEIVED A TESTIE `, res)
        })

        channel.on("web_note_created", res => {
            console.log(`Received nodes of web_note from backend broadcast`, res)
            console.log(`Current Active user (${userId}) `)

            const newlyCreatedNote: PeakNote = res.note
            const tags: PeakTag[] = res.tags
            batch(() => {
                store.dispatch(upsertNote(newlyCreatedNote))
                store.dispatch(addTags(tags))
            })
        })

        channel.onClose(res => {
            console.log(`${userId} CHANNEL IS BEING CLOSED!!!!`, res)
        })
    } else {
        console.error(`NO SOCKET?!?!??!?!`)
    }
}
