import {equals} from "ramda";

// Get the current page id without a hook
export function getCurrentPageId(): string | undefined {
    console.log(`DA CURRENT LOCATION`)
    console.log(window.location)

    const hash: string[] = window.location.hash.split("/")

    if (hash.length === 3 && equals(hash.slice(0,2), ["#", "home"]) ) {
        return hash[2]
    } else if (hash.length === 5 && equals(hash.slice(0,2), ["#", "topic"])) {
        return hash[4]
    }
    console.error(`PROBLEM?!?!? Were are we`)
    console.error(hash)
    return undefined
}