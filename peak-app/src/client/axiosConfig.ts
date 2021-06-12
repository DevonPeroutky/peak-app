import axios from 'axios';
import config from "../constants/environment-vars"

const defaultConfig = {
    withCredentials: true,
    baseURL: `${config.web_protocol}://${config.backend_domain}`
}
const authedAxiosClient = axios.create(defaultConfig);
export const blogAxiosClient = axios.create(defaultConfig);
export const BASE_URL = defaultConfig.baseURL

authedAxiosClient.interceptors.response.use(function (response) {
    return response;
}, function (error) {
    // if (error.response && error.response.status === 401) {
    //     window.location.href = "/"
    //     localStorage.clear()
    // }
    return Promise.reject(error);
});

export default authedAxiosClient;