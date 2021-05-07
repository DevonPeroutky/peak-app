import { truncate, capitalize } from "lodash"

export const DEFAULT_TRUNCATED_LENGTH = 25;
export const capitalize_and_truncate = (
    str: string,
    length: number = DEFAULT_TRUNCATED_LENGTH,
    ending: string = "...",
    all_words: boolean = true
) => {
    if (!str) return str
    const capitalizedString: string = (all_words) ? str.split(" ").map(s => capitalize(s)).join(" ") : capitalize(str)
    return truncate(capitalizedString, {
        'length': length,
        'omission': ending
    })
};



export function deriveEmailDomain(email: string): string {
    return email.endsWith("@gmail.com") ? "Personal" : capitalize(email.split("@").slice(-1)[0].split(".")[0])
}
