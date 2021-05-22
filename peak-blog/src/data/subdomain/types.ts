import exp from "constants";

export interface SubdomainAuthor {
    email: string
    given_name: string
    family_name: string
    last_name: string
    id: string
    image_url: string
    peak_user_id: string
}

export interface Subdomain {
    id: string
    description: string
    subdomain: string
    title: string
}

export interface SubdomainResponse {
    author: SubdomainAuthor | string
    subdomain: Subdomain | string
}

export const INITIAL_SUBDOMAIN_PAYLOAD = {
    author: null,
    subdomain: null
}
