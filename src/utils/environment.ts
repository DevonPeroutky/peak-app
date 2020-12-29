import config from "../constants/environment-vars";
import {ELECTRON} from "../constants/constants";

export const isElectron = config.dist === ELECTRON
export const isChromeExtension = process.env.NODE_ENV && process.env.NODE_ENV === 'chrome_extension'
