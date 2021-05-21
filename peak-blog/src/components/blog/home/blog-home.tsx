import {GetStaticProps} from "next";
import {fetch_posts_for_subdomain} from "../../../data/posts";
import {BlogPost} from "../../../types";
import {blogAxiosClient} from "../../../../../peak-app/src/client/axiosConfig";
import {useQuery} from "react-query";
import {PeakPost} from "component-library";
import {BlogFeed} from "./blog-feed";
import styles from "../../../../styles/Home.module.css";
import React from "react";

export const BlogHome = (props: { subdomain: string }) => {
    const { subdomain } = props
    const { isLoading, isError, status, data, error } = useQuery<PeakPost[], Error>(['posts'], () => fetch_posts_for_subdomain(subdomain) )

    if (isLoading) {
        return <div>Loading...</div>;
    }
    if (isError) {
        return <div>{error!.message}</div>;
    }

    console.log(`DATA `, data)

    return (
        <div className={styles.container}>
            {/* @ts-ignore */}
            <BlogFeed posts={data.posts}/>
        </div>
    )
}

export const getServerSideProps: GetStaticProps = async () => {

    const blog_posts: BlogPost[] = await blogAxiosClient.get(`http://localhost:4000/api/v1/users/108703174669232421421/pages`).then(res => {
        const wikiPage = res.data.pages
        return wikiPage.map(page => {
            return {
                title: page.title,
                id: page.id,
                privacy_level: page.privacy_level,
                inserted_at: page.inserted_at,
                body: page.body,
            }
        })
    })

    return {
        props: {
            posts: blog_posts
        }
    }
};
