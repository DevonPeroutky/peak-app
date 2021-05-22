import Router from "next/router"

export const parseSubdomain = (url: string) => {

    // TODO: Pull this from configured urls
    const subdomainRegex = /^(?:https?:\/\/)?(?:[^@\/\n]+@)?(?:www\.)?([^:\/?\n]+)(?:\.)(?:localhost|peak-blog)(?:\.com)?/
    const parsed_url = new URL(url)
    const parsed_subdomain = subdomainRegex.exec(parsed_url.hostname)

    if (parsed_subdomain === null || parsed_subdomain.length < 2) {
        Router.push("/500")
        return
    }

    // Seems risky
    return parsed_subdomain[1]
}