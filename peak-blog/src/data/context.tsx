import React, { createContext, useContext } from 'react';
import {SubdomainResponse} from "./subdomain/types";

const AppContext = createContext(null)
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