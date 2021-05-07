"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var dev = {
    base_url: "http://localhost:3000",
    electron_protocol: "peak-dev-app",
    env: "dev",
    dist: process.env.REACT_APP_DIST || "electron"
};
var prod = {
    base_url: "https://peak-webapp.onrender.com/",
    env: "prod",
    electron_protocol: "peak-app",
    dist: process.env.REACT_APP_DIST || "electron"
};
var config = process.env.REACT_APP_ENV === 'dev' ? dev : prod;
exports.default = __assign({}, config);
//# sourceMappingURL=environment-vars.js.map