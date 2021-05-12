import { NextPage, GetStaticProps } from "next";
import { BlogPost } from "../../types"
import {blogAxiosClient} from "../../../../peak-app/src/client/axiosConfig";
import styles from '../../../styles/Home.module.css'

const Post: NextPage<{ post: BlogPost }> = (props) => {
    const { post } = props
    console.log(post)
    return (
        <div className={styles.container}>
            <div className={"pt-24"}>
                <div className={"flex justify-center max-w-screen-md flex-grow px-10"}>
                    <div className={"header-content flex justify-center flex-col"}>
                        <h1 className="text-left text-5xl font-bold leading-5">{post.title}</h1>
                        <div>
                            <span>By Devon Peroutky</span>
                        </div>
                    </div>
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
        console.log(wikiPage)
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

    console.log(blog_posts)

    return {
        props: {
            post: blog_posts[0]
        }
    }
};

export default Post