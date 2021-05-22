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
import {useRouter} from "next/router";
import {MainLayout} from "../components/layout/layout";

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
    const router = useRouter()

    useEffect(() => {
        const subdomain = parseSubdomain(window.location.origin)
        if (subdomain) {
            fetch_subdomain(subdomain).then(res => setSubdomain(res.data)).catch(err => {
                console.log(err)
                console.log(err.response)
                if (err && err.response && err.response.status == 404) {
                    router.push("/404")
                } else {
                    router.push("/500")
                }
            })
        }

    }, [])

    if (subdomainData === INITIAL_SUBDOMAIN_PAYLOAD) return <div>LOAD THIS HO</div>

    return (
        <AppWrapper value={subdomainData}>
            <QueryClientProvider client={baseQueryClient}>
                {/*<div className={styles.container}>*/}
                {/*    <Component {...pageProps} />*/}
                {/*</div>*/}
                <MainLayout>
                    <Component {...pageProps} />
                </MainLayout>
            </QueryClientProvider>
        </AppWrapper>
    )
}

export default MyApp
