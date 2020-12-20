import axios from 'axios';
import {backend_host_address} from "../constants/constants";
import {isElectron} from "../utils/environment";

const defaultConfig = {
    withCredentials: true,
    baseURL: backend_host_address
}
const authedAxiosClient = axios.create(defaultConfig);

axios.interceptors.response.use(function (response) {
    // Do something with response data
    console.log(`RUNNING THE INTERCEPTOR`)
    return response;
}, function (error) {
    // Do something with response error
    console.log(`RUNNING THE ERROR INTERCEPTOR`)
    console.log(error.response)
    console.log(error.response.data)
    console.log(error.response.status)
    window.location.href = "/"
    localStorage.clear()
    return Promise.reject(error);
});

export default authedAxiosClient;