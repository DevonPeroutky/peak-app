import { NextPage, GetStaticProps } from "next";
import { BlogPost } from "../../types"
import styles from '../../../styles/Home.module.css'
import {DisplayEditor} from "../../components/rich-text-editor/DisplayEditor";
import React, {useEffect} from "react";

// TODO: Move this to shared
import {blogAxiosClient} from "../../../../peak-app/src/client/axiosConfig";

const Post: NextPage<{ post: BlogPost }> = (props) => {
    const { post } = props
    console.log(post)

    return (
        <div className={styles.container}>
            <div className={styles.contentContainer}>
                <div>
                    <DisplayEditor value={post.body} postId={"cool-id"}/>
                </div>
                <div className={"flex flex-col max-w-screen-md w-3/4 flex-grow"}>
                    <div className={"header-content flex justify-center flex-col"}>
                        <h1 className="text-left leading-tight my-8">{post.title}</h1>
                        <div>
                            <span>By Devon Peroutky</span>
                        </div>
                    </div>
                    <main className="py-8">
                        <p className={"text-lg"}>
                            Although the research progress is worrying, the fish still have to be touched." Driven by such a concept, Caiji finally tossed out a plan that seemed to be OK at the moment. My blog was originally forked from Huxpro/huxpro.github.io , and after using it for a while, I started to change it, changing the clean code of others into a mess. The blog uses the Jekyll framework, and Jekyll is the default engine of Github Pages, so Github Pages will save you even the build step when deploying. So for a long time, as a lazy rookie, I didn't have much motivation to toss these things. But the reason why I have to toss now is because it is impossible not to toss.
                        </p>
                        <h2>Strange cause</h2>
                        <p>
                            Speaking of it, this is still a long story. First of all, the formula rendering engine of my blog is Katex , because it is faster, much faster than Mathjax (refer to here ).
                        </p>
                    </main>
                    <ul>
                        <li>Coffee</li>
                        <li>Tea</li>
                        <li>Milk</li>
                    </ul>
                    <div>THE FOOTER</div>
                </div>
            </div>
        </div>
    );
};

// TODO: move to getStaticProps?
export const getServerSideProps: GetStaticProps = async () => {
    console.log(`Fetching static Props`)
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
            post: blog_posts[0]
        }
    }
};

export default Post