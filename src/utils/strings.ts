import { truncate, capitalize } from "lodash"

export const DEFAULT_TRUNCATED_LENGTH = 25;
export const capitalize_and_truncate = (str: string, length: number = DEFAULT_TRUNCATED_LENGTH, ending: string = "...") => {
    return truncate(capitalize(str), {
        'length': length,
        'omission': ending
    }, )
};
