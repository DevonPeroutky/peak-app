import { blogAxiosClient } from "../../../../peak-app/src/client/axiosConfig";
import { PeakPost } from "component-library";

export function fetch_posts_for_subdomain(subdomain: string): Promise<PeakPost[]> {
    return blogAxiosClient.get<{posts: PeakPost[]}>(`http://localhost:4000/blog/v1/posts?subdomain=${subdomain}`).then(res => res.data.posts)
}

export function fetch_post(post_id: string): Promise<PeakPost> {
    return blogAxiosClient.get<{post: PeakPost}>(`http://localhost:4000/blog/v1/posts/${post_id}`).then(res => res.data.post)
}
