import peakAxiosClient from "./axiosConfig";

export function loadUserRequest(userId: string) {
    return peakAxiosClient.get(`/api/v1/users/${userId}`)
}
