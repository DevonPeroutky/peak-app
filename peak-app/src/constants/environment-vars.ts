import {ELECTRON} from "./constants";

interface PeakAppConfig {
    app_server_domain: string
    web_socket_protocol: string
    web_protocol: string
    backend_domain: string
    blog_domain: string
    electron_protocol: string
    env: string
    dist: string
}

const dev: PeakAppConfig = {
    web_socket_protocol: "ws",
    web_protocol: "http",
    app_server_domain: "localhost:3001",
    blog_domain: "localhost:3000",
    backend_domain: "localhost:4000",
    env: "dev",
    electron_protocol: "peak-dev-app",
    dist: process.env.REACT_APP_DIST || ELECTRON
}

const prod: PeakAppConfig = {
    web_socket_protocol: "wss",
    web_protocol: "https",
    app_server_domain: process.env.REACT_APP_APP_SERVER_ADDRESS || "you-need-to-set-this.com",
    backend_domain: process.env.REACT_APP_BACKEND_SERVER_ADDRESS || "you-need-to-set-this.com",
    blog_domain: process.env.REACT_APP_BLOG_ADDRESS || "you-need-to-set-this.com",
    env: "prod",
    electron_protocol: "peak-app",
    dist: process.env.REACT_APP_DIST || ELECTRON
}

console.log(`REACT_APP_ENV: `, process.env.REACT_APP_ENV)
console.log(`REACT_APP_DIST: `, process.env.REACT_APP_DIST)
const config = process.env.REACT_APP_ENV === 'dev' ? dev : prod

export default {
    ...config
};

