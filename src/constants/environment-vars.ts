const dev = {
    base_url: "http://localhost:3000",
    electron_protocol: "peak-dev-app",
    env: "dev",
    dist: process.env.REACT_APP_DIST || "electron"
}

const prod = {
    base_url: "https://peak-webapp.onrender.com/",
    env: "prod",
    electron_protocol: "peak-app",
    dist: process.env.REACT_APP_DIST || "electron"
}

const config = process.env.REACT_APP_ENV === 'dev' ? dev : prod

export default {
    ...config
};

