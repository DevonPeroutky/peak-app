import Link from "next/link";
import styles from "../../../styles/Home.module.css";
import cn from 'classnames'
import {useAppContext} from "../../data/context";

export default function BlogHeader() {
    const { subdomain } = useAppContext()

    return (
        <Link href={"/"}>
            <header className={cn(styles.contentContainer, "cursor-pointer mb-16")}>
                <h1 className={"leading-tight text-center text-blue-500 text-6xl hover:text-blue-400"}>{subdomain.title}</h1>
                <span className={"leading-tight text-center text-base text-gray-400 font-normal"}>{subdomain.description}</span>
            </header>
        </Link>
    )
}
