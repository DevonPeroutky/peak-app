import peakAxiosClient from "./axiosConfig";

export function login_via_chrome_extension(userId: string) {
    return peakAxiosClient.get(`/api/v1/session/login-via-extension?user_id=${userId}`)
}
