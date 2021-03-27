import peakAxiosClient from "../axiosConfig";
import { Node } from "slate";

export function updateScratchpadRequest(userId: string, body: Node[], scratchpadId: string) {
    return peakAxiosClient.put(`/api/v1/users/${userId}/scratchpad/${scratchpadId}`, {
        "scratchpad": {
            "body": body
        }
    })
}
