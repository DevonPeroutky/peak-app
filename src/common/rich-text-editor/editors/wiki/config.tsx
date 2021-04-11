import { WithNormalizeTypes } from "@udecode/slate-plugins";
import {TITLE} from "../../types";

export const wikiNormalizers: WithNormalizeTypes = {
    rules: [{ path: [0, 0], strictType: TITLE }],
}
