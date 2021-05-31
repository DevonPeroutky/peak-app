import '../../styles/globals.css'
import 'component-library/dist/index.css'
import {QueryClient, QueryClientProvider, useQueryClient} from "react-query";
import React, {useEffect, useState} from "react";
import {parseSubdomain} from "../utils/subdomains";
import {AppWrapper} from "../data/context";
import {INITIAL_SUBDOMAIN_PAYLOAD, SUBDOMAIN_LOADING_STATE, SubdomainResponse} from "../data/subdomain/types";
import {fetch_subdomain} from "../data/subdomain/subdomain";
import Error from 'next/error'
import {MainLayout} from "../components/layout/layout";
import "nprogress/nprogress.css";
import nprogress from 'nprogress/nprogress.js'
import {useRouter} from "next/router";
import {sleep} from "../../../peak-app/src/chrome-extension/utils/generalUtil";

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
    const [subdomainData, setSubdomainData] = useState<SubdomainResponse>(INITIAL_SUBDOMAIN_PAYLOAD)
    const [subdomainState, setSubdomain] = useState<SUBDOMAIN_LOADING_STATE>(SUBDOMAIN_LOADING_STATE.TBD)
    const router = useRouter()

    useEffect(() => {
        router.events.on('routeChangeComplete', (url, { shallow }) => nprogress.done())
        router.events.on('routeChangeStart', (url, { shallow }) => nprogress.start())
    }, [])

    useEffect(() => {
        const subdomain = parseSubdomain(window.location.origin)
        nprogress.start()
        if (subdomain) {
            setSubdomain(SUBDOMAIN_LOADING_STATE.LOADING)
            fetch_subdomain(subdomain).then(res => {
                setSubdomainData(res.data)
                setSubdomain(SUBDOMAIN_LOADING_STATE.LOADED)
            }).catch(err => {
                setSubdomain(SUBDOMAIN_LOADING_STATE.FAILED_TO_LOAD)
            }).finally(() => {
                nprogress.done()
            })
        } else {
            setSubdomain(SUBDOMAIN_LOADING_STATE.FAILED_TO_DERIVE)
        }
    }, [])

    if (subdomainState === SUBDOMAIN_LOADING_STATE.FAILED_TO_LOAD || subdomainState === SUBDOMAIN_LOADING_STATE.FAILED_TO_DERIVE) return <Error statusCode={404} />

    return (
        <AppWrapper value={subdomainData}>
            <QueryClientProvider client={baseQueryClient}>
                <MainLayout>
                    <Component {...pageProps} />
                </MainLayout>
            </QueryClientProvider>
        </AppWrapper>
    )
}

export default MyApp
