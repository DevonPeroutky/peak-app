import { blogAxiosClient } from "../../../../peak-app/src/client/axiosConfig";
import {PeakPost, PeakPostListResponse} from "component-library";

export function fetch_posts_for_subdomain(subdomain: string, cursor?: string): Promise<PeakPostListResponse> {
    const cursorQueryParam = (cursor) ? `&cursor=${cursor}` : ``
    return blogAxiosClient
        .get<PeakPostListResponse>(`http://localhost:4000/blog/v1/posts?subdomain=${subdomain}${cursorQueryParam}`)
        .then(res => res.data)
}

export function fetch_post(post_id: string): Promise<PeakPost> {
    return blogAxiosClient.get<{post: PeakPost}>(`http://localhost:4000/blog/v1/posts/${post_id}`).then(res => res.data.post)
}
