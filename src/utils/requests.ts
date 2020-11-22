import { PeakHierarchy } from "../redux/userSlice";
import axios from "axios";
import {Node} from "slate";
import {backend_host_address} from "../constants/constants";


interface PeakPageParams {
    topicId?: string
    title?: string
    body?: Node[]
}
export function updatePage(userId: string, pageId: string, updatedPageParams: PeakPageParams, hierarchy: PeakHierarchy) {
    return axios.put(`${backend_host_address}/api/v1/users/${userId}/pages/${pageId}`, {
        "page": updatedPageParams,
        "hierarchy": hierarchy
    })
}