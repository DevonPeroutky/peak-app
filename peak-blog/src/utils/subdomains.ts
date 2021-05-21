export const parseSubdomain = (url: string) => {

    // TODO: Pull this from configured urls
    const subdomainRegex = /^(?:https?:\/\/)?(?:[^@\/\n]+@)?(?:www\.)?([^:\/?\n]+)(?:\.)(?:localhost|peak-blog)(?:\.com)?/
    const parsed_url = new URL(url)
    const parsed_subdomain = subdomainRegex.exec(parsed_url.hostname)

    // Seems risky
    return parsed_subdomain[1]
}