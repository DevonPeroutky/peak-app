import styles from "../../../styles/Home.module.css";
import React, {useEffect} from "react";
import "nprogress/nprogress.css";
import nprogress from 'nprogress/nprogress.js'
import {useRouter} from "next/router";
import {sleep} from "../../../../peak-app/src/chrome-extension/utils/generalUtil";

export const MainLayout = ({children}) => {
    const router = useRouter()

    useEffect(() => {
        router.events.on('routeChangeComplete', (url, { shallow }) => nprogress.done())
        router.events.on('routeChangeStart', (url, { shallow }) => nprogress.start())
    }, [])

    return (
        <div className={styles.container}>
            {/*<BlogHeader/>*/}
            <div className={styles.contentContainer}>
                {children}
            </div>
        </div>
    )
}
