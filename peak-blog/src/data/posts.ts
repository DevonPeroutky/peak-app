import {BlogPost, HydratedSubdomain} from "../types";
import { blogAxiosClient } from "../../../peak-app/src/client/axiosConfig";
import { PeakPost } from "component-library";

type Params = {
    queryKey: [string, { subdomain: string }];
};
export function fetch_posts_for_subdomain(params: Params): Promise<PeakPost[]> {
    const subdomain = "swag"
    // const [, { subdomain }] = params.queryKey
    return blogAxiosClient.get<PeakPost[]>(`http://localhost:4000/blog/v1/posts?subdomain=${subdomain}`).then(res => res.data)
}

export function fetch_blog_posts(subdomain: string): BlogPost[] {

    return []
}


export function fetch_subdomain(subDomain: string): HydratedSubdomain {
    return undefined
}