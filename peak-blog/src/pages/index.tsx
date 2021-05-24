import React from "react";
import {BlogHome} from "../components/blog/home/blog-home";
import {InitialLoader} from "../components/loaders/InitialLoader";
import {useAppContext} from "../data/context";

const App = () => {
    const { subdomain } = useAppContext()

    console.log(`"WTF`)

    return (
        <>
            {/* @ts-ignore */}
            {(subdomain) ? <BlogHome subdomain={subdomain.subdomain}/> : <InitialLoader/>}
        </>
    )
}
export default App
