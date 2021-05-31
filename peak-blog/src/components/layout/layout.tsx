import styles from "../../../styles/Home.module.css";
import React, {useEffect} from "react";

export const MainLayout = ({children}) => {
    return (
        <div className={styles.container}>
            <div className={styles.contentContainer}>
                {children}
            </div>
        </div>
    )
}
