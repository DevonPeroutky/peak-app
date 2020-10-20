import {ELECTRON} from "./constants";

const dev = {
    base_url: "http://localhost:3001",
    env: "dev",
    protocol: "peak-dev-app",
    dist: process.env.REACT_APP_DIST || ELECTRON
}

const prod = {
    base_url: "https://peak-webapp.onrender.com/",
    env: "prod",
    protocol: "peak-app",
    dist: process.env.REACT_APP_DIST || ELECTRON
}

const config = process.env.REACT_APP_ENV === 'dev' ? dev : prod

export default {
    ...config
};

