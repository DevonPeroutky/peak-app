import React, {useEffect, useState} from "react";
import {QueryClient, QueryClientProvider} from "react-query";
import {Example} from "../components/example/Example";
import {BlogHome} from "../components/blog/home/blog-home";
import {parseSubdomain} from "../utils/subdomains";
import {InitialLoader} from "../components/initial-loader/InitialLoader";

// Create a client
const baseQueryClient = new QueryClient({
        defaultOptions: {
            queries: {
                refetchOnWindowFocus: true,
            },
        }
    }
)

const App = () => {
    const [subdomain, setSubdomain] = useState<string>(null)

    useEffect(() => {
        console.log(`The window.location `, window.location)
        const subdomain = parseSubdomain(window.location.origin)
        setSubdomain(subdomain)
        console.log(`Subdomain ${subdomain}`)
    }, [])

    return (
          <>
              <QueryClientProvider client={baseQueryClient}>
                  { (subdomain) ? <BlogHome subdomain={subdomain}/> : <InitialLoader/> }
              </QueryClientProvider>
          </>
      )
}
export default App
