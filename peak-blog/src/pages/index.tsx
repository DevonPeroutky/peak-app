import React from "react";
import {BlogHome} from "../components/blog/home/blog-home";
import {InitialLoader} from "../components/initial-loader/InitialLoader";
import styles from "../../styles/Home.module.css";
import {useAppContext} from "../data/context";

const App = () => {
    const { subdomain } = useAppContext()

    return (
        <div className={styles.container}>
            {/* @ts-ignore */}
            {(subdomain) ? <BlogHome subdomain={subdomain.subdomain}/> : <InitialLoader/>}
        </div>
    )
}
export default App
