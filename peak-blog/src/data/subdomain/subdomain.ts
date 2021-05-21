import { blogAxiosClient } from "../../../../peak-app/src/client/axiosConfig";
import { SubdomainResponse } from "./types";

export function fetch_subdomain(subdomain: string): Promise<SubdomainResponse> {
    return blogAxiosClient.get<SubdomainResponse>(`http://localhost:4000/blog/v1?subdomain=${subdomain}`).then(res => res.data)
}
