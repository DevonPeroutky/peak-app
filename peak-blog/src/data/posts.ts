import {BlogPost, HydratedSubdomain} from "../types";
import { blogAxiosClient } from "../../../peak-app/src/client/axiosConfig";
import { PeakPost } from "component-library";


export function fetch_posts_for_subdomain(subdomain: string): PeakPost[] {
    blogAxiosClient.get<PeakPost>(`http://localhost:4000/blog/v1/posts?subdomain=${subdomain}`).then(res => {
        console.log("BRO")
        console.log(res.data)
    })

    return []
}

export function fetch_blog_posts(subdomain: string): BlogPost[] {

    return []
}


export function fetch_subdomain(subDomain: string): HydratedSubdomain {
    return undefined
}