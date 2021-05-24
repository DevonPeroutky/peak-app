import {AxiosResponse} from "axios";
import {BlogConfiguration} from "../redux/slices/blog/types";
import peakAxiosClient from "./axiosConfig";

export const fetchBlogConfiguration = (userId: string): Promise<AxiosResponse<BlogConfiguration>> => {
    return peakAxiosClient.get<BlogConfiguration>(`/api/v1/users/${userId}/blog`)
}

export const createBlogRequest = (userId: string, blog_payload: BlogConfiguration): Promise<AxiosResponse<BlogConfiguration>> => {
    return peakAxiosClient.post<BlogConfiguration>(`/api/v1/users/${userId}/blog`, { subdomain: blog_payload })
}

export const updateBlogConfigurationRequest = (userId: string, blog_payload: BlogConfiguration): Promise<AxiosResponse<BlogConfiguration>> => {
    return peakAxiosClient.put<BlogConfiguration>(`/api/v1/users/${userId}/blog/${blog_payload.id}`, { subdomain: blog_payload })
}
