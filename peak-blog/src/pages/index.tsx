import React from "react";
import {BlogHome} from "../components/blog/home/blog-home";
import {InitialLoader} from "../components/initial-loader/InitialLoader";
import {useAppContext} from "../data/context";
import {PeakLogo} from "../components/logo/peak-logo";
import Link from "next/link";

const App = () => {
    const { subdomain } = useAppContext()

    return (
        <>
            {/* @ts-ignore */}
            {(subdomain) ? <BlogHome subdomain={subdomain.subdomain}/> : <InitialLoader/>}
        </>
    )
}
export default App
