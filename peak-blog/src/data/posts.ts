import {BlogPost, HydratedSubdomain} from "../types";
import authedAxiosClient from "../../../peak-app/src/client/axiosConfig";


export function temp_fetch_pages(user_id: string): BlogPost[] {
    authedAxiosClient.get(`/api/v1/users/${user_id}/pages`).then(res => {
        console.log(res)
    })

    return []
}

export function fetch_blog_posts(subdomain: string): BlogPost[] {

    return []
}


export function fetch_subdomain(subDomain: string): HydratedSubdomain {
    return undefined
}