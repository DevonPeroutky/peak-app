import axios from 'axios';
import {backend_host_address} from "../constants/constants";
import {isElectron} from "../utils/environment";

const defaultConfig = {
    withCredentials: true,
    baseURL: backend_host_address
}
const authedAxiosClient = axios.create(defaultConfig);

authedAxiosClient.interceptors.response.use(function (response) {
    return response;
}, function (error) {
    if (error.response && error.response.status === 401) {
        window.location.href = "/"
        localStorage.clear()
    }
    return Promise.reject(error);
});

export default authedAxiosClient;