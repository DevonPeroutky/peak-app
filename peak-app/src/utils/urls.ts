import { useLocation } from "react-router-dom";
import config from '../constants/environment-vars'

export const useQuery = () => {
    return new URLSearchParams(useLocation().search);
}

export const deriveHostname = (urlStr: string) => {
    const url = new URL(urlStr);
    return url.hostname.replace(/^(www\.)/,"");
}

export const isValidHttpUrl = (string): boolean => {
    let url;

    try {
        url = new URL(string);
    } catch (_) {
        return false;
    }

    return url.protocol === "http:" || url.protocol === "https:";
}


// og: https://twitter.com/bgurley/status/1377674626210222082
// id: 1377674626210222082
export const validateTwitterUrl = (url: string): string | undefined => {
    if (!isValidHttpUrl(url)) {
        return undefined
    }
    const og_url = new URL(url)

    let re = /^\/[a-zA-Z0-9]+\/status\/\d+/
    const res = re.exec(og_url.pathname)
    if (og_url.hostname === "twitter.com" && res ) {
        return url
    }
    return undefined

}

export const parseTwitterId = (url: string): string | undefined => {
    if (!isValidHttpUrl(url)) {
        return undefined
    }
    const og_url = new URL(url)

    let re = /^\/[a-zA-Z0-9]+\/status\/\d+/
    const res = re.exec(og_url.pathname)
    if (og_url.hostname === "twitter.com" && res ) {
        const pathNames: string[] = (og_url.pathname) ? og_url.pathname.split("/") : []
        if (pathNames.length < 4) {
            return undefined
        }
        return pathNames[3]
    }
    return undefined
}


// og: https://www.youtube.com/watch?v=oVgn5s13H6Y
// dest: https://www.youtube.com/embed/oVgn5s13H6Y
export const parseYoutubeEmbedUrl = (url: string): string | undefined => {
    if (!isValidHttpUrl(url)) {
        return undefined
    }

    const og_url = new URL(url)
    const videoId = og_url.searchParams.get("v")
    const embeddedUrl: string = `https://www.youtube.com/embed/${videoId}`

    if (og_url.hostname === "www.youtube.com" && videoId) {
        return url
    }
    return undefined
}

export const blogUrlFromSubdomain = (subdomain: string): string => {
    return `${config.web_protocol}://${subdomain}.${config.blog_domain}`
}