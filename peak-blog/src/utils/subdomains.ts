export const parseSubdomain = (url: string) => {

    // TODO: Pull the match urls from configured urls
    const subdomainRegex = /^(?:https?:\/\/)?(?:[^@\/\n]+@)?(?:www\.)?([^:\/?\n]+)(?:\.)(?:localhost|peak-blog)(?:\.com)?/
    const parsed_url = new URL(url)
    const parsed_subdomain = subdomainRegex.exec(parsed_url.hostname)

    if (parsed_subdomain === null || parsed_subdomain.length < 2) {
        return
    }

    // Seems risky
    return parsed_subdomain[1]
}