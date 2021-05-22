import { blogAxiosClient } from "../../../../peak-app/src/client/axiosConfig";
import { SubdomainResponse } from "./types";
import {AxiosResponse} from "axios";

export function fetch_subdomain(subdomain: string): Promise<AxiosResponse<SubdomainResponse>> {
    return blogAxiosClient.get<SubdomainResponse>(`http://localhost:4000/blog/v1?subdomain=${subdomain}`)
}
