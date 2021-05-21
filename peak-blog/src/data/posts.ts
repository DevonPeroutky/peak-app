import {BlogPost, HydratedSubdomain} from "../types";
import { blogAxiosClient } from "../../../peak-app/src/client/axiosConfig";
import { PeakPost } from "component-library";

export function fetch_posts_for_subdomain(subdomain: string): Promise<PeakPost[]> {
    return blogAxiosClient.get<PeakPost[]>(`http://localhost:4000/blog/v1/posts?subdomain=${subdomain}`).then(res => res.data)
}
