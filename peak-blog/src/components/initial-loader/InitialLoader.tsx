import React, {useEffect} from "react";

export const InitialLoader = (props: {}) => {
    useEffect(() => {
        console.log(`Location `, window.location)
    }, [])

    return <div>Loading...</div>
}