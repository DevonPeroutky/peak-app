import {establishSocketConnection, subscribeToTopic} from "../../../utils/socketUtil";
import {JOURNAL_CHANNEL_ID} from "../../../common/rich-text-editor/editors/journal/constants";
import {Channel} from "phoenix";

/**
 * @param channel
 * @param userId
 */
export function establishSocketChannelConnection(channel: Channel, userId: string): Promise<Channel> {
    if (!channel) {
        console.log(`Establish a new socket connection`)

        // TODO Remove the redux dependency from this
        return establishSocketConnection(userId).then(socket => {
            return subscribeToTopic(socket, JOURNAL_CHANNEL_ID(userId))
        })
    } else {
        console.log(`Reusing the existing socket connection`, channel)
        return Promise.resolve(channel)
    }
}
