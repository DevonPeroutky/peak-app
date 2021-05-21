import '../../styles/globals.css'
import 'component-library/dist/index.css'
import {QueryClient, QueryClientProvider, useQuery} from "react-query";
import React, {useEffect, useState} from "react";
import {parseSubdomain} from "../utils/subdomains";
import {AppWrapper} from "../data/context";
import {SubdomainResponse} from "../data/subdomain/types";
import {fetch_subdomain} from "../data/subdomain/subdomain";

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
    const [subdomainData, setSubdomain] = useState<SubdomainResponse>(null)

    useEffect(() => {
        const subdomain = parseSubdomain(window.location.origin)
        if (subdomain) {
            fetch_subdomain(subdomain).then(setSubdomain)
        }

    }, [])

    return (
        <AppWrapper value={subdomainData}>
            <QueryClientProvider client={baseQueryClient}>
                <Component {...pageProps} />
            </QueryClientProvider>
        </AppWrapper>
    )
}

export default MyApp
