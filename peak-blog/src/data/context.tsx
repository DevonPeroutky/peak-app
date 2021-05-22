import React, { createContext, useContext } from 'react';
import {INITIAL_SUBDOMAIN_PAYLOAD, SubdomainResponse} from "./subdomain/types";

const AppContext = createContext<SubdomainResponse>(INITIAL_SUBDOMAIN_PAYLOAD)
export function AppWrapper(props) {
    const {value, children} = props

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
}

export function useAppContext(): SubdomainResponse {
    return useContext<SubdomainResponse>(AppContext);
}