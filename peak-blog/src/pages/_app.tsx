import '../../styles/globals.css'
import 'component-library/dist/index.css'
import {QueryClient, QueryClientProvider} from "react-query";
import React, {useEffect, useState} from "react";
import {parseSubdomain} from "../utils/subdomains";

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
    return (
        <QueryClientProvider client={baseQueryClient}>
            <Component {...pageProps} />
        </QueryClientProvider>
    )
}

export default MyApp
