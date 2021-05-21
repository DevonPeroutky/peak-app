import React, {useEffect, useState} from "react";
import {BlogHome} from "../components/blog/home/blog-home";
import {parseSubdomain} from "../utils/subdomains";
import {InitialLoader} from "../components/initial-loader/InitialLoader";
import styles from "../../styles/Home.module.css";

const App = () => {
    const [subdomain, setSubdomain] = useState<string>(null)

    useEffect(() => {
        const subdomain = parseSubdomain(window.location.origin)
        setSubdomain(subdomain)
    }, [])

    console.log(`RE RENDERING THE APP?!??!?!`)

    return (
        <div className={styles.container}>
            {/* @ts-ignore */}
            {(subdomain) ? <BlogHome subdomain={subdomain}/> : <InitialLoader/>}
        </div>
    )
}
export default App
