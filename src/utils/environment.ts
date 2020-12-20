import config from "../constants/environment-vars";
import {ELECTRON} from "../constants/constants";

export const isElectron = config.dist === ELECTRON
