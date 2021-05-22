import React from "react";
import {BlogHome} from "../components/blog/home/blog-home";
import {InitialLoader} from "../components/initial-loader/InitialLoader";
import {useAppContext} from "../data/context";

const App = () => {
    const { subdomain } = useAppContext()

    return (
        <>
            <header className={"flex justify-center w-full leading-normal"}>
                <div className={"flex max-w-3xl w-2/5 justify-between"}>
                    <div>Logo Here</div>
                    <div>Sign in here?</div>
                </div>
            </header>
            {/* @ts-ignore */}
            {(subdomain) ? <BlogHome subdomain={subdomain.subdomain}/> : <InitialLoader/>}
        </>
    )
}
export default App
