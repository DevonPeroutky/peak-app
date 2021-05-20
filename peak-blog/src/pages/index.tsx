import React from "react";
import {QueryClient, QueryClientProvider} from "react-query";
import {Example} from "../components/example/Example";
import {BlogHome} from "../components/blog/home/blog-home";

// Create a client
const baseQueryClient = new QueryClient({
        defaultOptions: {
            queries: {
                refetchOnWindowFocus: true,
            },
        }
    }
)

export default function App() {
  return (
      <>
          <QueryClientProvider client={baseQueryClient}>
            <BlogHome/>
          </QueryClientProvider>
          <Example/>
      </>
  )
}
