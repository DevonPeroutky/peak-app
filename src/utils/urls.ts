import { capitalize } from "lodash";
import { useLocation } from "react-router-dom";

export const useQuery = () => {
    return new URLSearchParams(useLocation().search);
}

export const deriveBaseDomain = (urlStr: string) => {
    const url = new URL(urlStr);
    const urlDomain: string = url.hostname.split('.').slice(0, -1).join(" ");
    console.log(`URL`, urlStr)
    console.log(`HOST`, url.hostname)
    console.log(`DOMAIN`, urlDomain)
    return urlDomain
}

export const deriveHostname = (urlStr: string) => {
    const url = new URL(urlStr);
    return url.hostname
}