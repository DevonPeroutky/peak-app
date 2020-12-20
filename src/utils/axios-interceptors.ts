import axios from "axios";

axios.interceptors.response.use(function (response) {
    // Do something with response data
    console.log(`RUNNING THE INTERCEPTOR`)
    return response;
}, function (error) {
    // Do something with response error
    console.log(`RUNNING THE ERROR INTERCEPTOR`)
    console.log(JSON.stringify(error))
    return Promise.reject(error);
});