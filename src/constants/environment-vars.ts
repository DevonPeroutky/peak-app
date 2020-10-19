import {ELECTRON} from "./constants";

const dev = {
    base_url: "http://localhost:3001",
    env: "dev",
    protocol: process.env.REACT_APP_DIST == ELECTRON ? "peak-dev-app" : "http",
    dist: process.env.REACT_APP_DIST || ELECTRON
}

const prod = {
    base_url: "https://peak-webapp.onrender.com/",
    env: "prod",
    protocol: process.env.REACT_APP_DIST == ELECTRON ? "peak-app" : "https",
    dist: process.env.REACT_APP_DIST || ELECTRON
}

const config = process.env.REACT_APP_ENV === 'dev' ? dev : prod

export default {
    ...config
};

