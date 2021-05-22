import '../../styles/globals.css'
import 'component-library/dist/index.css'
import {QueryClient, QueryClientProvider, useQuery} from "react-query";
import React, {useEffect, useState} from "react";
import {parseSubdomain} from "../utils/subdomains";
import {AppWrapper} from "../data/context";
import {INITIAL_SUBDOMAIN_PAYLOAD, SubdomainResponse} from "../data/subdomain/types";
import {fetch_subdomain} from "../data/subdomain/subdomain";
import styles from "../../styles/Home.module.css";
import {PeakLogo} from "../components/logo/peak-logo";
import Link from "next/link";

// Create a client
const baseQueryClient = new QueryClient({
        defaultOptions: {
            queries: {
                refetchOnWindowFocus: false,
            },
        }
    }
)

function MyApp({ Component, pageProps }) {
    const [subdomainData, setSubdomain] = useState<SubdomainResponse>(INITIAL_SUBDOMAIN_PAYLOAD)

    useEffect(() => {
        const subdomain = parseSubdomain(window.location.origin)
        if (subdomain) {
            fetch_subdomain(subdomain).then(setSubdomain)
        }

    }, [])

    return (
        <AppWrapper value={subdomainData}>
            <QueryClientProvider client={baseQueryClient}>
                <header className={"flex justify-center w-full leading-normal py-10"}>
                    <div className={"flex max-w-3xl w-2/5 justify-between items-center"}>
                        <PeakLogo/>
                        <Link href={"/"}>
                            <span className={"flex items-center justify-center hover:bg-blue-50 cursor-pointer p-4 h-10 rounded"}>Home</span>
                        </Link>
                    </div>
                </header>
                <div className={styles.container}>
                    <Component {...pageProps} />
                </div>
            </QueryClientProvider>
        </AppWrapper>
    )
}

export default MyApp
