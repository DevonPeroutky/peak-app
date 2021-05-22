import styles from "../../../styles/Home.module.css";
import React from "react";
import BlogHeader from "../blog/header";

export const MainLayout = ({children}) => (
    <div className={styles.container}>
        <BlogHeader/>
        <div className={styles.contentContainer}>
            {children}
        </div>
    </div>
)